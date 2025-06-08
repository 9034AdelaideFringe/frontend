import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import App from "./App";

// Mock the dependencies
vi.mock("./routes", () => ({
  default: () => <div data-testid="app-routes">App Routes</div>,
}));

vi.mock("./services/connectionManager", () => ({
  ConnectionProvider: ({ children }) => (
    <div data-testid="connection-provider">{children}</div>
  ),
}));

vi.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
}));

describe("App", () => {
  beforeEach(() => {
    // Mock console.log
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the app with correct structure", () => {
    const { getByTestId } = render(<App />);

    // Verify the component hierarchy
    expect(getByTestId("connection-provider")).toBeInTheDocument();
    expect(getByTestId("router")).toBeInTheDocument();
    expect(getByTestId("app-routes")).toBeInTheDocument();
  });

  it("logs the API URL from environment variables", () => {
    render(<App />);

    // Just verify console.log was called with the expected pattern
    expect(console.log).toHaveBeenCalledWith(
      "VITE_APP_API_URL:12",
      expect.anything()
    );
  });

  it("wraps components in the correct order", () => {
    const { container } = render(<App />);

    // Check the nesting order: ConnectionProvider > Router > AppRoutes
    const connectionProvider = container.querySelector(
      '[data-testid="connection-provider"]'
    );
    const router = connectionProvider.querySelector('[data-testid="router"]');
    const appRoutes = router.querySelector('[data-testid="app-routes"]');

    expect(connectionProvider).toBeInTheDocument();
    expect(router).toBeInTheDocument();
    expect(appRoutes).toBeInTheDocument();
  });
});
