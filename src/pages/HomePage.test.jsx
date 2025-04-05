import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import HomePage from "./HomePage";
import * as eventService from "../services/eventService";

// 模拟服务和路由
vi.mock("../services/eventService");
vi.mock("react-router-dom", () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

describe("HomePage", () => {
  it("renders featured events section", async () => {
    // 模拟返回数据
    eventService.getFeaturedEvents.mockResolvedValue([
      {
        id: "1",
        title: "Featured Event 1",
        abstract: "Featured abstract 1",
        image: "test1.jpg",
      },
    ]);

    const { container } = render(<HomePage />);

    // 验证页面标题 - 使用基本选择器
    const headings = Array.from(container.querySelectorAll("h1, h2, h3"));
    const mainHeading = headings.find((h) =>
      h.textContent.toLowerCase().includes("adelaide fringe")
    );

    expect(mainHeading).toBeDefined();

    // 等待加载完成和事件渲染
    await waitFor(() => {
      const eventTitle = screen.getByText("Featured Event 1");
      expect(eventTitle).toBeDefined();
    });
  });
});
