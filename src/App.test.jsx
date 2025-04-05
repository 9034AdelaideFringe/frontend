import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import App from "./App";

// 模拟环境变量和路由模块
vi.mock("react-router-dom", () => {
  const actual = vi.importActual("react-router-dom");
  return {
    ...actual,
    BrowserRouter: ({ children }) => (
      <div data-testid="mock-router">{children}</div>
    ),
    Routes: ({ children }) => <div data-testid="mock-routes">{children}</div>,
    Route: ({ children }) => <div data-testid="mock-route">{children}</div>,
  };
});

// 模拟 AppRoutes
vi.mock("./routes", () => ({
  default: () => <div data-testid="mock-app-routes">Mocked Routes</div>,
}));

describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(<App />);

    // 验证 App 渲染成功，且包含模拟的路由组件
    expect(
      container.querySelector('[data-testid="mock-router"]')
    ).toBeDefined();
    expect(
      container.querySelector('[data-testid="mock-app-routes"]')
    ).toBeDefined();
  });
});
