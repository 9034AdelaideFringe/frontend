import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// 创建一个简单组件用于测试
const SimpleComponent = ({ title, content }) => (
  <div>
    <h1 data-testid="title">{title}</h1>
    <p data-testid="content">{content}</p>
  </div>
);

describe("SimpleComponent", () => {
  it("renders title and content", () => {
    render(<SimpleComponent title="测试标题" content="测试内容" />);

    // 使用 test ID 定位元素，避免 getByText 等需要 jest-dom
    const titleElement = screen.getByTestId("title");
    const contentElement = screen.getByTestId("content");

    expect(titleElement.textContent).toBe("测试标题");
    expect(contentElement.textContent).toBe("测试内容");
  });
});
