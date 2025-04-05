import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import EventCard from "./EventCard";

// 模拟 react-router-dom 以避免路由问题
vi.mock("react-router-dom", () => ({
  Link: ({ to, children, className }) => (
    <a href={to} className={className} data-testid="learn-more-link">
      {children}
    </a>
  ),
}));

describe("EventCard", () => {
  const mockEvent = {
    id: "1",
    title: "Test Event",
    abstract: "Test abstract",
    image: "test.jpg",
  };

  it("renders event information correctly", () => {
    const { container } = render(<EventCard event={mockEvent} />);

    // 使用标准 DOM 查询和基本断言
    const titleElement = screen.getByText("Test Event");
    const abstractElement = screen.getByText("Test abstract");
    const imageElement = screen.getByAltText("Test Event");
    const linkElement = screen.getByTestId("learn-more-link");

    expect(titleElement).toBeDefined();
    expect(abstractElement).toBeDefined();
    expect(imageElement.getAttribute("src")).toBe("test.jpg");
    expect(linkElement.getAttribute("href")).toBe("/events/1");
    expect(linkElement.textContent).toBe("Learn More");
  });
});
