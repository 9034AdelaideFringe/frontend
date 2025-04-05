import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import EventList from "./EventList";

// 模拟 EventCard 组件和路由
vi.mock("./EventCard", () => ({
  default: ({ event }) => (
    <div data-testid={`event-card-${event.id}`}>
      <h3>{event.title}</h3>
      <p>{event.abstract}</p>
    </div>
  ),
}));

describe("EventList", () => {
  const mockEvents = [
    {
      id: "1",
      title: "Test Event 1",
      abstract: "Abstract 1",
      image: "test1.jpg",
    },
    {
      id: "2",
      title: "Test Event 2",
      abstract: "Abstract 2",
      image: "test2.jpg",
    },
  ];

  it("renders a list of events", () => {
    const { container } = render(<EventList events={mockEvents} />);

    // 使用标准 DOM 属性验证
    expect(screen.getByText("Test Event 1")).toBeDefined();
    expect(screen.getByText("Test Event 2")).toBeDefined();
    expect(screen.getByText("Abstract 1")).toBeDefined();
    expect(screen.getByText("Abstract 2")).toBeDefined();

    // 验证事件卡片的数量
    expect(screen.getAllByTestId(/^event-card-/)).toHaveLength(2);
  });

  it("renders an empty grid when no events", () => {
    const { container } = render(<EventList events={[]} title="Empty List" />);

    // 验证标题存在
    expect(screen.getByText("Empty List")).toBeDefined();

    // 验证网格存在但为空
    const grid = container.querySelector("div[class*='grid']");
    expect(grid).toBeDefined();
    expect(grid.children.length).toBe(0);
  });
});
