import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import EventList from "./EventList";

// Mock EventCard component and routing
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
    render(<EventList events={mockEvents} />);

    expect(screen.getByText("Test Event 1")).toBeDefined();
    expect(screen.getByText("Test Event 2")).toBeDefined();
    expect(screen.getByText("Abstract 1")).toBeDefined();
    expect(screen.getByText("Abstract 2")).toBeDefined();
    expect(screen.getAllByTestId(/^event-card-/)).toHaveLength(2);
  });

  it("renders an empty grid when no events", () => {
    const { container } = render(<EventList events={[]} title="Empty List" />);

    expect(screen.getByText("Empty List")).toBeDefined();

    const grid = container.querySelector("div[class*='grid']");
    expect(grid).toBeDefined();
    expect(grid.children.length).toBe(0);
  });

  it("renders with default title when title not provided", () => {
    render(<EventList events={mockEvents} />);
    expect(screen.getByText("Event List")).toBeDefined();
  });

  it("renders with custom title when provided", () => {
    render(<EventList events={mockEvents} title="Featured Events" />);
    expect(screen.getByText("Featured Events")).toBeDefined();
  });

  it("renders without title when title is empty string", () => {
    render(<EventList events={mockEvents} title="" />);
    expect(screen.queryByText("Event List")).toBeNull();
  });

  it("handles single event", () => {
    const singleEvent = [mockEvents[0]];
    render(<EventList events={singleEvent} />);

    expect(screen.getByText("Test Event 1")).toBeDefined();
    expect(screen.getAllByTestId(/^event-card-/)).toHaveLength(1);
  });
});
