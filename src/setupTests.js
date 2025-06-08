import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { vi } from "vitest";

// 自动清理每个测试后的渲染组件
afterEach(() => {
  cleanup();
});

// 启用全局工具函数
window.IS_REACT_ACT_ENVIRONMENT = true;

// 控制台错误处理
const originalConsoleError = console.error;
console.error = (...args) => {
  // 忽略已知的React测试库警告
  if (
    args[0]?.includes("Warning: ReactDOM.render is no longer supported") ||
    args[0]?.includes(
      "Warning: The current testing environment is not configured to support act"
    )
  ) {
    return;
  }
  originalConsoleError(...args);
};

// 模拟fetch
global.fetch = vi.fn();

// 重置所有mocks
import { beforeEach } from "vitest";
beforeEach(() => {
  vi.resetAllMocks();
});

// 添加自定义断言来模拟常用的 jest-dom 功能
// 如果你不想使用 jest-dom，但又需要一些简单的 DOM 断言
expect.extend({
  toBeInTheDocument(received) {
    const pass = Boolean(received && document.body.contains(received));
    return {
      message: () =>
        `expected element ${pass ? "not " : ""}to be in the document`,
      pass,
    };
  },
});

// 静默控制台错误，可选 - 注释掉以便调试
// vi.spyOn(console, "error").mockImplementation(() => {});
