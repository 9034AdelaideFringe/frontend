import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import EventDetailPage from "./EventDetailPage";
import * as eventService from "../services/eventService";

// 模拟服务
vi.mock("../services/eventService");

// 模拟 react-router-dom 和 useParams
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

describe("EventDetailPage", () => {
  const mockEvent = {
    id: "1",
    title: "Detailed Event",
    abstract: "Event abstract",
    description: "Full event description",
    date: "2025-03-10",
    time: "19:30",
    venue: "Test Venue",
    price: "40-120",
    image: "event.jpg",
  };

  beforeEach(() => {
    eventService.getEventById.mockResolvedValue(mockEvent);
  });

  it("displays event details", async () => {
    const { container } = render(<EventDetailPage />);

    // 等待加载完成
    await waitFor(() => {
      const titleElement = screen.getByText("Detailed Event");
      expect(titleElement).toBeDefined();
    });

    // 验证详情显示
    const descElement = screen.getByText("Full event description");
    const venueElement = screen.getByText("Test Venue");
    const dateElement = screen.getByText("2025-03-10");
    const timeElement = screen.getByText("19:30");
    const priceElement = screen.getByText("40-120");

    expect(descElement).toBeDefined();
    expect(venueElement).toBeDefined();
    expect(dateElement).toBeDefined();
    expect(timeElement).toBeDefined();
    expect(priceElement).toBeDefined();
  });

  it("handles event not found", async () => {
    // 修改 useParams 模拟返回不同的 ID
    vi.mocked(eventService.getEventById).mockRejectedValueOnce(
      new Error("Event not found")
    );

    const { container } = render(<EventDetailPage />);

    await waitFor(() => {
      const errorElements = Array.from(container.querySelectorAll("*")).filter(
        (el) => el.textContent.toLowerCase().includes("event not found")
      );
      expect(errorElements.length).toBeGreaterThan(0);
    });
  });
});
