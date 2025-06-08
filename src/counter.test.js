import { describe, it, expect, beforeEach, vi } from "vitest";
import { setupCounter } from "./counter";

describe("Counter", () => {
  let mockElement;

  beforeEach(() => {
    mockElement = {
      innerHTML: "",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      click: vi.fn(),
    };
  });

  describe("setupCounter", () => {
    it("should initialize counter with 0", () => {
      setupCounter(mockElement);

      expect(mockElement.innerHTML).toBe("count is 0");
    });

    it("should add click event listener", () => {
      setupCounter(mockElement);

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "click",
        expect.any(Function)
      );
    });

    it("should increment counter on click", () => {
      setupCounter(mockElement);

      // Get the click handler from the addEventListener call
      const clickHandler = mockElement.addEventListener.mock.calls[0][1];

      // Simulate clicks
      clickHandler();
      expect(mockElement.innerHTML).toBe("count is 1");

      clickHandler();
      expect(mockElement.innerHTML).toBe("count is 2");

      clickHandler();
      expect(mockElement.innerHTML).toBe("count is 3");
    });

    it("should handle multiple increments correctly", () => {
      setupCounter(mockElement);

      const clickHandler = mockElement.addEventListener.mock.calls[0][1];

      // Click multiple times
      for (let i = 1; i <= 10; i++) {
        clickHandler();
        expect(mockElement.innerHTML).toBe(`count is ${i}`);
      }
    });

    it("should work with real DOM element", () => {
      const realElement = document.createElement("button");
      document.body.appendChild(realElement);

      setupCounter(realElement);

      expect(realElement.innerHTML).toBe("count is 0");

      // Simulate click
      realElement.click();
      expect(realElement.innerHTML).toBe("count is 1");

      realElement.click();
      expect(realElement.innerHTML).toBe("count is 2");

      // Cleanup
      document.body.removeChild(realElement);
    });

    it("should handle rapid clicks", () => {
      setupCounter(mockElement);

      const clickHandler = mockElement.addEventListener.mock.calls[0][1];

      // Simulate rapid clicking
      for (let i = 0; i < 100; i++) {
        clickHandler();
      }

      expect(mockElement.innerHTML).toBe("count is 100");
    });

    it("should maintain separate counters for different elements", () => {
      const element1 = { innerHTML: "", addEventListener: vi.fn() };
      const element2 = { innerHTML: "", addEventListener: vi.fn() };

      setupCounter(element1);
      setupCounter(element2);

      const clickHandler1 = element1.addEventListener.mock.calls[0][1];
      const clickHandler2 = element2.addEventListener.mock.calls[0][1];

      // Click element1 twice
      clickHandler1();
      clickHandler1();
      expect(element1.innerHTML).toBe("count is 2");

      // Click element2 once
      clickHandler2();
      expect(element2.innerHTML).toBe("count is 1");

      // Verify they maintain separate state
      expect(element1.innerHTML).toBe("count is 2");
      expect(element2.innerHTML).toBe("count is 1");
    });

    it("should handle element without innerHTML property gracefully", () => {
      const elementWithoutInnerHTML = {
        addEventListener: vi.fn(),
      };

      expect(() => {
        setupCounter(elementWithoutInnerHTML);
      }).not.toThrow();

      expect(elementWithoutInnerHTML.addEventListener).toHaveBeenCalled();
    });

    it("should handle element without addEventListener gracefully", () => {
      const elementWithoutAddEventListener = {
        innerHTML: "",
      };

      expect(() => {
        setupCounter(elementWithoutAddEventListener);
      }).toThrow();
    });

    it("should set innerHTML correctly for different count values", () => {
      setupCounter(mockElement);

      const clickHandler = mockElement.addEventListener.mock.calls[0][1];

      // Test various count values
      const testCounts = [0, 1, 5, 10, 42, 99, 100];

      for (let i = 0; i < testCounts.length - 1; i++) {
        const targetCount = testCounts[i + 1];
        const currentCount = testCounts[i];
        const clicksNeeded = targetCount - currentCount;

        for (let j = 0; j < clicksNeeded; j++) {
          clickHandler();
        }

        expect(mockElement.innerHTML).toBe(`count is ${targetCount}`);
      }
    });
  });

  describe("Integration tests", () => {
    it("should work with various HTML elements", () => {
      const elements = [
        document.createElement("button"),
        document.createElement("div"),
        document.createElement("span"),
        document.createElement("p"),
      ];

      elements.forEach((element, index) => {
        document.body.appendChild(element);
        setupCounter(element);

        expect(element.innerHTML).toBe("count is 0");

        // Click different number of times for each element
        for (let i = 0; i < index + 1; i++) {
          element.click();
        }

        expect(element.innerHTML).toBe(`count is ${index + 1}`);

        document.body.removeChild(element);
      });
    });

    it("should handle edge cases", () => {
      setupCounter(mockElement);

      const clickHandler = mockElement.addEventListener.mock.calls[0][1];

      // Test starting from 0
      expect(mockElement.innerHTML).toBe("count is 0");

      // Test single increment
      clickHandler();
      expect(mockElement.innerHTML).toBe("count is 1");

      // Test many increments to verify no overflow issues
      for (let i = 1; i < 1000; i++) {
        clickHandler();
      }
      expect(mockElement.innerHTML).toBe("count is 1000");
    });
  });
});
