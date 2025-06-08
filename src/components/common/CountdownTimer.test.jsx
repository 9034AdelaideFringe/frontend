import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CountdownTimer from "./CountdownTimer";

// Mock the CSS module
vi.mock("./CountdownTimer.module.css", () => ({
  default: {
    countdownContainer: "mock-countdown-container",
    countdownTimer: "mock-countdown-timer",
    timeUnit: "mock-time-unit",
    timeValue: "mock-time-value",
    timeSeparator: "mock-time-separator",
  },
}));

describe("CountdownTimer", () => {
  beforeEach(() => {
    // Mock Date and toLocaleTimeString
    const mockDate = new Date("2024-01-01T14:30:00Z");
    vi.spyOn(global, "Date").mockImplementation(() => mockDate);
    vi.spyOn(mockDate, "toLocaleTimeString").mockReturnValue("14:30");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  describe("Component Rendering", () => {
    it("should render countdown timer with correct structure", () => {
      render(<CountdownTimer />);

      const container = screen.getByRole("generic");
      expect(container).toHaveClass("mock-countdown-container");

      // Check for time separator
      expect(screen.getByText(":")).toBeInTheDocument();
      expect(screen.getByText(":")).toHaveClass("mock-time-separator");
    });

    it("should display time correctly", () => {
      render(<CountdownTimer />);

      expect(screen.getByText("14")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
      expect(screen.getByText(":")).toBeInTheDocument();
    });

    it("should have correct CSS classes applied", () => {
      const { container } = render(<CountdownTimer />);

      expect(container.firstChild).toHaveClass("mock-countdown-container");
      expect(
        container.querySelector(".mock-countdown-timer")
      ).toBeInTheDocument();
      expect(container.querySelectorAll(".mock-time-unit")).toHaveLength(2);
      expect(container.querySelectorAll(".mock-time-value")).toHaveLength(2);
    });
  });

  describe("Component Structure", () => {
    it("should maintain semantic structure", () => {
      const { container } = render(<CountdownTimer />);

      const timeUnits = container.querySelectorAll(".mock-time-unit");
      expect(timeUnits).toHaveLength(2);

      timeUnits.forEach((unit) => {
        expect(unit.querySelector(".mock-time-value")).toBeInTheDocument();
      });
    });

    it("should render time separator", () => {
      render(<CountdownTimer />);

      const separator = screen.getByText(":");
      expect(separator).toHaveClass("mock-time-separator");
    });
  });

  describe("Component Lifecycle", () => {
    it("should clean up interval on unmount", () => {
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");

      const { unmount } = render(<CountdownTimer />);

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it("should start interval immediately on mount", () => {
      const setIntervalSpy = vi.spyOn(global, "setInterval");

      render(<CountdownTimer />);

      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    });
  });

  describe("Different Time Formats", () => {
    it("should handle different time values", () => {
      const testCases = [
        { time: "09:05", hour: "09", minute: "05" },
        { time: "23:59", hour: "23", minute: "59" },
        { time: "00:00", hour: "00", minute: "00" },
        { time: "12:30", hour: "12", minute: "30" },
      ];

      testCases.forEach(({ time, hour, minute }) => {
        const mockDate = new Date();
        vi.spyOn(global, "Date").mockImplementation(() => mockDate);
        vi.spyOn(mockDate, "toLocaleTimeString").mockReturnValue(time);

        const { unmount } = render(<CountdownTimer />);

        expect(screen.getByText(hour)).toBeInTheDocument();
        expect(screen.getByText(minute)).toBeInTheDocument();

        unmount();
        vi.restoreAllMocks();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle malformed time string gracefully", () => {
      const mockDate = new Date();
      vi.spyOn(global, "Date").mockImplementation(() => mockDate);
      vi.spyOn(mockDate, "toLocaleTimeString").mockReturnValue(
        "invalid:time:format"
      );

      const { container } = render(<CountdownTimer />);

      // Should not crash, component should still render
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle empty time string", () => {
      const mockDate = new Date();
      vi.spyOn(global, "Date").mockImplementation(() => mockDate);
      vi.spyOn(mockDate, "toLocaleTimeString").mockReturnValue("");

      const { container } = render(<CountdownTimer />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should handle exception in toLocaleTimeString", () => {
      const mockDate = new Date();
      vi.spyOn(global, "Date").mockImplementation(() => mockDate);
      vi.spyOn(mockDate, "toLocaleTimeString").mockImplementation(() => {
        throw new Error("Timezone error");
      });

      expect(() => render(<CountdownTimer />)).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("should be accessible with proper structure", () => {
      const { container } = render(<CountdownTimer />);

      // Check that time values are present
      expect(screen.getByText("14")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
      expect(screen.getByText(":")).toBeInTheDocument();
    });

    it("should maintain proper component hierarchy", () => {
      const { container } = render(<CountdownTimer />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass("mock-countdown-container");

      const timerContainer = mainContainer.querySelector(
        ".mock-countdown-timer"
      );
      expect(timerContainer).toBeInTheDocument();

      const timeUnits = timerContainer.querySelectorAll(".mock-time-unit");
      expect(timeUnits).toHaveLength(2);
    });
  });
});
