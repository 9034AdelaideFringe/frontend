import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EventCard from "./EventCard";

// Mock react-router-dom to avoid routing issues
vi.mock("react-router-dom", () => ({
  Link: ({ to, children, className }) => (
    <a href={to} className={className} data-testid="event-link">
      {children}
    </a>
  ),
}));

// Mock defaultImages module
vi.mock("./defaultImages", () => ({
  getRandomDefaultImageUrl: vi.fn(() => "https://example.com/default.jpg"),
}));

// Mock environment variables
beforeEach(() => {
  vi.stubEnv("VITE_APP_IMAGE_BASE_URL", "https://example.com/images");
});

describe("EventCard", () => {
  const mockEvent = {
    id: "1",
    title: "Test Event",
    abstract: "Test abstract",
    image: "test.jpg",
  };

  it("renders event information correctly", () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText("Test Event")).toBeDefined();
    expect(screen.getByText("Test abstract")).toBeDefined();
    expect(screen.getByAltText("Test Event")).toBeDefined();
    expect(screen.getByTestId("event-link")).toBeDefined();
  });

  it("handles missing image with default", () => {
    const eventWithoutImage = { ...mockEvent, image: null };
    render(<EventCard event={eventWithoutImage} />);

    const image = screen.getByAltText("Test Event");
    expect(image.getAttribute("src")).toBe("https://example.com/default.jpg");
  });

  it("handles missing title with fallback", () => {
    const eventWithoutTitle = { ...mockEvent, title: null };
    render(<EventCard event={eventWithoutTitle} />);

    expect(screen.getByText("Untitled Event")).toBeDefined();
  });

  it("handles missing abstract with fallback", () => {
    const eventWithoutAbstract = { ...mockEvent, abstract: null };
    render(<EventCard event={eventWithoutAbstract} />);

    expect(screen.getByText("No description available.")).toBeDefined();
  });

  it("handles image loading error", () => {
    render(<EventCard event={mockEvent} />);

    const image = screen.getByAltText("Test Event");
    fireEvent.error(image);

    expect(image.getAttribute("src")).toBe("https://example.com/default.jpg");
  });

  it("handles full HTTP URL images", () => {
    const eventWithHttpImage = {
      ...mockEvent,
      image: "https://external.com/image.jpg",
    };
    render(<EventCard event={eventWithHttpImage} />);

    const image = screen.getByAltText("Test Event");
    expect(image.getAttribute("src")).toBe("https://external.com/image.jpg");
  });

  it("constructs image URL correctly with base URL", () => {
    render(<EventCard event={mockEvent} />);

    const image = screen.getByAltText("Test Event");
    expect(image.getAttribute("src")).toBe(
      "https://example.com/images/test.jpg"
    );
  });

  it("handles invalid image path types", () => {
    const eventWithInvalidImage = { ...mockEvent, image: 123 };
    render(<EventCard event={eventWithInvalidImage} />);

    const image = screen.getByAltText("Test Event");
    expect(image.getAttribute("src")).toBe("https://example.com/default.jpg");
  });

  it("creates correct link to event detail", () => {
    render(<EventCard event={mockEvent} />);

    const link = screen.getByTestId("event-link");
    expect(link.getAttribute("href")).toBe("/events/1");
  });
});
