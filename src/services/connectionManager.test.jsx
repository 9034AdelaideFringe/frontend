import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import {
  ConnectionProvider,
  useConnectionManager,
  withFallback,
} from "./connectionManager";

// Test component to access connection context
function TestComponent() {
  const {
    connectionType,
    setConnectionType,
    lastError,
    lastChecked,
    resetConnection,
    handleFailure,
  } = useConnectionManager();

  return (
    <div>
      <div data-testid="connection-type">{connectionType}</div>
      <div data-testid="last-error">{lastError?.message || "none"}</div>
      <div data-testid="last-checked">
        {lastChecked?.toISOString() || "none"}
      </div>
      <button
        data-testid="set-supabase"
        onClick={() => setConnectionType("supabase")}
      >
        Set Supabase
      </button>
      <button data-testid="reset-connection" onClick={resetConnection}>
        Reset
      </button>
      <button
        data-testid="handle-failure"
        onClick={() => handleFailure(new Error("Test error"))}
      >
        Handle Failure
      </button>
    </div>
  );
}

describe("ConnectionManager", () => {
  describe("ConnectionProvider", () => {
    it("should provide default connection state", () => {
      render(
        <ConnectionProvider>
          <TestComponent />
        </ConnectionProvider>
      );

      expect(screen.getByTestId("connection-type")).toHaveTextContent(
        "primary"
      );
      expect(screen.getByTestId("last-error")).toHaveTextContent("none");
      expect(screen.getByTestId("last-checked")).toHaveTextContent("none");
    });

    it("should allow setting connection type", async () => {
      render(
        <ConnectionProvider>
          <TestComponent />
        </ConnectionProvider>
      );

      const setSupabaseButton = screen.getByTestId("set-supabase");

      await act(async () => {
        setSupabaseButton.click();
      });

      expect(screen.getByTestId("connection-type")).toHaveTextContent(
        "supabase"
      );
    });

    it("should reset connection to primary", async () => {
      render(
        <ConnectionProvider>
          <TestComponent />
        </ConnectionProvider>
      );

      // First set to supabase
      await act(async () => {
        screen.getByTestId("set-supabase").click();
      });

      expect(screen.getByTestId("connection-type")).toHaveTextContent(
        "supabase"
      );

      // Then reset
      await act(async () => {
        screen.getByTestId("reset-connection").click();
      });

      expect(screen.getByTestId("connection-type")).toHaveTextContent(
        "primary"
      );
      expect(screen.getByTestId("last-error")).toHaveTextContent("none");
    });

    it("should handle failure and switch to supabase", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      render(
        <ConnectionProvider>
          <TestComponent />
        </ConnectionProvider>
      );

      await act(async () => {
        screen.getByTestId("handle-failure").click();
      });

      expect(screen.getByTestId("connection-type")).toHaveTextContent(
        "supabase"
      );
      expect(screen.getByTestId("last-error")).toHaveTextContent("Test error");
      expect(screen.getByTestId("last-checked")).not.toHaveTextContent("none");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("切换到 Supabase 备用数据库"),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it("should not switch connection if already on supabase", async () => {
      render(
        <ConnectionProvider>
          <TestComponent />
        </ConnectionProvider>
      );

      // Set to supabase first
      await act(async () => {
        screen.getByTestId("set-supabase").click();
      });

      // Handle failure when already on supabase
      await act(async () => {
        screen.getByTestId("handle-failure").click();
      });

      expect(screen.getByTestId("connection-type")).toHaveTextContent(
        "supabase"
      );
      expect(screen.getByTestId("last-error")).toHaveTextContent("Test error");
    });
  });

  describe("useConnectionManager hook", () => {
    it("should throw error when used outside provider", () => {
      const TestComponentWithoutProvider = () => {
        useConnectionManager();
        return <div>Test</div>;
      };

      // Suppress console errors for this test
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe("withFallback utility", () => {
    it("should call primary function when connection is primary", async () => {
      const primaryFn = vi.fn().mockResolvedValue("primary result");
      const supabaseFn = vi.fn().mockResolvedValue("supabase result");

      function TestWithFallback() {
        const wrappedFn = withFallback(primaryFn, supabaseFn);

        return (
          <button
            data-testid="call-wrapped"
            onClick={() => wrappedFn("test-arg")}
          >
            Call
          </button>
        );
      }

      render(
        <ConnectionProvider>
          <TestWithFallback />
        </ConnectionProvider>
      );

      await act(async () => {
        screen.getByTestId("call-wrapped").click();
      });

      expect(primaryFn).toHaveBeenCalledWith("test-arg");
      expect(supabaseFn).not.toHaveBeenCalled();
    });

    it("should call supabase function when connection is supabase", async () => {
      const primaryFn = vi.fn().mockResolvedValue("primary result");
      const supabaseFn = vi.fn().mockResolvedValue("supabase result");

      function TestWithFallback() {
        const { setConnectionType } = useConnectionManager();
        const wrappedFn = withFallback(primaryFn, supabaseFn);

        return (
          <div>
            <button
              data-testid="set-supabase"
              onClick={() => setConnectionType("supabase")}
            >
              Set Supabase
            </button>
            <button
              data-testid="call-wrapped"
              onClick={() => wrappedFn("test-arg")}
            >
              Call
            </button>
          </div>
        );
      }

      render(
        <ConnectionProvider>
          <TestWithFallback />
        </ConnectionProvider>
      );

      // Set connection to supabase
      await act(async () => {
        screen.getByTestId("set-supabase").click();
      });

      // Call wrapped function
      await act(async () => {
        screen.getByTestId("call-wrapped").click();
      });

      expect(supabaseFn).toHaveBeenCalledWith("test-arg");
      expect(primaryFn).not.toHaveBeenCalled();
    });

    it("should fallback to supabase when primary fails", async () => {
      const primaryFn = vi.fn().mockRejectedValue(new Error("Primary failed"));
      const supabaseFn = vi.fn().mockResolvedValue("supabase result");
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      function TestWithFallback() {
        const wrappedFn = withFallback(primaryFn, supabaseFn);

        return (
          <button
            data-testid="call-wrapped"
            onClick={() => wrappedFn("test-arg")}
          >
            Call
          </button>
        );
      }

      render(
        <ConnectionProvider>
          <TestWithFallback />
        </ConnectionProvider>
      );

      await act(async () => {
        screen.getByTestId("call-wrapped").click();
      });

      expect(primaryFn).toHaveBeenCalledWith("test-arg");
      expect(supabaseFn).toHaveBeenCalledWith("test-arg");

      consoleSpy.mockRestore();
    });

    it("should throw error when both primary and supabase fail", async () => {
      const primaryFn = vi.fn().mockRejectedValue(new Error("Primary failed"));
      const supabaseFn = vi
        .fn()
        .mockRejectedValue(new Error("Supabase failed"));
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      function TestWithFallback() {
        const wrappedFn = withFallback(primaryFn, supabaseFn);

        return (
          <button
            data-testid="call-wrapped"
            onClick={async () => {
              try {
                await wrappedFn("test-arg");
              } catch (error) {
                // Expected to fail
              }
            }}
          >
            Call
          </button>
        );
      }

      render(
        <ConnectionProvider>
          <TestWithFallback />
        </ConnectionProvider>
      );

      await act(async () => {
        screen.getByTestId("call-wrapped").click();
      });

      expect(primaryFn).toHaveBeenCalled();
      expect(supabaseFn).toHaveBeenCalled();

      consoleSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });
});
