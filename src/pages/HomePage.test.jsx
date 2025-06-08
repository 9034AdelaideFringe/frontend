import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import HomePage from "./HomePage";
import * as eventService from "../services/eventService";

// 模拟服务和路由
vi.mock("../services/eventService");
vi.mock("react-router-dom", () => ({
  Link: ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));
vi.mock("../utils/EventList", () => ({
  default: ({ events, title }) => (
    <div data-testid="event-list">
      <h2>{title}</h2>
      {events.map((event) => (
        <div key={event.id} data-testid={`event-${event.id}`}>
          {event.title}
        </div>
      ))}
    </div>
  ),
}));
vi.mock("../components/common/CountdownTimer", () => ({
  default: () => <div data-testid="countdown-timer">Timer</div>,
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 模拟console方法
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders hero section with title and typewriter", async () => {
    eventService.getFeaturedEvents.mockResolvedValue([]);

    render(<HomePage />);

    // 验证主标题
    expect(screen.getByText("Welcome to Adelaide Fringe")).toBeInTheDocument();

    // 验证Browse All Events链接
    const browseLink = screen.getByText("Browse All Events");
    expect(browseLink).toBeInTheDocument();
    expect(browseLink.getAttribute("href")).toBe("/events");
  });

  it("displays loading state initially", () => {
    eventService.getFeaturedEvents.mockImplementation(
      () => new Promise(() => {})
    ); // Never resolves

    render(<HomePage />);

    expect(screen.getByText("Loading featured events...")).toBeInTheDocument();
  });

  it("renders featured events when loaded successfully", async () => {
    const mockEvents = [
      {
        id: "1",
        title: "Featured Event 1",
        abstract: "Featured abstract 1",
        image: "test1.jpg",
      },
      {
        id: "2",
        title: "Featured Event 2",
        abstract: "Featured abstract 2",
        image: "test2.jpg",
      },
    ];

    eventService.getFeaturedEvents.mockResolvedValue(mockEvents);

    render(<HomePage />);

    // 等待加载完成
    await waitFor(() => {
      expect(
        screen.queryByText("Loading featured events...")
      ).not.toBeInTheDocument();
    });

    // 验证EventList组件被渲染
    expect(screen.getByTestId("event-list")).toBeInTheDocument();
    expect(screen.getByText("Featured Events")).toBeInTheDocument();
    expect(screen.getByTestId("event-1")).toBeInTheDocument();
    expect(screen.getByTestId("event-2")).toBeInTheDocument();
  });

  it("handles data wrapped in data property", async () => {
    const mockEvents = [{ id: "1", title: "Event 1" }];
    const wrappedData = { data: mockEvents };

    eventService.getFeaturedEvents.mockResolvedValue(wrappedData);

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId("event-list")).toBeInTheDocument();
    });

    expect(screen.getByTestId("event-1")).toBeInTheDocument();
  });

  it("handles non-array data gracefully", async () => {
    eventService.getFeaturedEvents.mockResolvedValue({ invalid: "data" });

    render(<HomePage />);

    await waitFor(() => {
      expect(
        screen.getByText("No featured events available at this time.")
      ).toBeInTheDocument();
    });

    expect(console.warn).toHaveBeenCalledWith(
      "[HomePage] getFeaturedEvents returned non-array data:",
      { invalid: "data" }
    );
  });

  it("displays error message when fetch fails", async () => {
    const errorMessage = "Network error";
    eventService.getFeaturedEvents.mockRejectedValue(new Error(errorMessage));

    render(<HomePage />);

    await waitFor(() => {
      expect(
        screen.getByText(`Error loading featured events: ${errorMessage}`)
      ).toBeInTheDocument();
    });

    expect(console.error).toHaveBeenCalledWith(
      "[HomePage] Error fetching featured events:",
      expect.any(Error)
    );
  });

  it("displays error message with default text when error has no message", async () => {
    eventService.getFeaturedEvents.mockRejectedValue({});

    render(<HomePage />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Error loading featured events: Failed to load featured events."
        )
      ).toBeInTheDocument();
    });
  });

  it("displays no events message when empty array is returned", async () => {
    eventService.getFeaturedEvents.mockResolvedValue([]);

    render(<HomePage />);

    await waitFor(() => {
      expect(
        screen.getByText("No featured events available at this time.")
      ).toBeInTheDocument();
    });
  });

  it("does not render featured events section when loading", () => {
    eventService.getFeaturedEvents.mockImplementation(
      () => new Promise(() => {})
    );

    render(<HomePage />);

    expect(screen.queryByTestId("event-list")).not.toBeInTheDocument();
    expect(screen.getByText("Loading featured events...")).toBeInTheDocument();
  });

  it("does not render featured events section when there's an error", async () => {
    eventService.getFeaturedEvents.mockRejectedValue(new Error("Test error"));

    render(<HomePage />);

    await waitFor(() => {
      expect(
        screen.getByText("Error loading featured events: Test error")
      ).toBeInTheDocument();
    });

    expect(screen.queryByTestId("event-list")).not.toBeInTheDocument();
  });

  it("logs component render and useEffect trigger", async () => {
    eventService.getFeaturedEvents.mockResolvedValue([]);

    render(<HomePage />);

    expect(console.log).toHaveBeenCalledWith("[HomePage] Component rendered.");
    expect(console.log).toHaveBeenCalledWith("[HomePage] useEffect triggered.");

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "[HomePage] getFeaturedEvents success:",
        []
      );
    });
  });

  it("has correct CSS classes applied", () => {
    eventService.getFeaturedEvents.mockResolvedValue([]);

    const { container } = render(<HomePage />);

    // 验证主容器存在（CSS模块会添加hash）
    const homePageDiv = container.firstChild;
    expect(homePageDiv.className).toMatch(/homePage/);

    // 验证hero section存在
    const heroSection = container.querySelector("section");
    expect(heroSection.className).toMatch(/heroSection/);

    // 验证按钮类存在
    const browseButton = screen.getByText("Browse All Events");
    expect(browseButton.className).toMatch(/btn/);
    expect(browseButton.className).toMatch(/btnPrimary/);
  });
});
