import {
  useState,
  useCallback,
  createContext,
  useContext,
  useEffect,
} from "react";

// Create context to share connection state across the app
const ConnectionContext = createContext({
  connectionType: "primary",
  setConnectionType: () => {},
  lastError: null,
  resetConnection: () => {},
});

export function ConnectionProvider({ children }) {
  const [connectionType, setConnectionType] = useState("primary");
  const [lastError, setLastError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  // Reset connection to primary backend
  const resetConnection = useCallback(() => {
    setConnectionType("primary");
    setLastError(null);
    setLastChecked(new Date());
  }, []);

  // Handle API call failure, switch to backup database
  const handleFailure = useCallback(
    (error) => {
      setLastError(error);
      setLastChecked(new Date());
      if (connectionType !== "supabase") {
        console.log(
          "Primary backend connection failed, switching to Supabase backup database",
          error
        );
        setConnectionType("supabase");
      }
    },
    [connectionType]
  );

  const value = {
    connectionType,
    setConnectionType,
    lastError,
    lastChecked,
    resetConnection,
    handleFailure,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnectionManager() {
  return useContext(ConnectionContext);
}

// Utility function to wrap API calls
export function withFallback(primaryFn, supabaseFn) {
  const { connectionType, handleFailure, resetConnection } =
    useConnectionManager();

  return async (...args) => {
    try {
      // Try using primary backend
      if (connectionType === "primary") {
        const result = await primaryFn(...args);
        return result;
      }

      // If currently using Supabase, try using it
      const result = await supabaseFn(...args);
      return result;
    } catch (error) {
      // If error when using primary backend, switch to Supabase
      if (connectionType === "primary") {
        handleFailure(error);
        // Recursively call itself, this time will use Supabase
        return withFallback(primaryFn, supabaseFn)(...args);
      }

      // If Supabase also fails, throw error directly
      throw error;
    }
  };
}
