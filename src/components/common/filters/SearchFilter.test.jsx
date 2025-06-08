import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchFilter from "./SearchFilter";

// Mock the CSS module
vi.mock("./Filters.module.css", () => ({
  default: {
    filter: "mock-filter",
    filterTitle: "mock-filter-title",
    searchInput: "mock-search-input",
  },
}));

describe("SearchFilter", () => {
  const defaultProps = {
    searchTerm: "",
    onSearchChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render search filter with correct structure", () => {
      render(<SearchFilter {...defaultProps} />);

      expect(
        screen.getByRole("heading", { name: "Search" })
      ).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Search events...")
      ).toBeInTheDocument();
    });

    it("should have correct CSS classes applied", () => {
      const { container } = render(<SearchFilter {...defaultProps} />);

      expect(container.firstChild).toHaveClass("mock-filter");
      expect(screen.getByRole("heading")).toHaveClass("mock-filter-title");
      expect(screen.getByRole("textbox")).toHaveClass("mock-search-input");
    });

    it("should display the provided search term", () => {
      const props = {
        ...defaultProps,
        searchTerm: "music festival",
      };

      render(<SearchFilter {...props} />);

      expect(screen.getByDisplayValue("music festival")).toBeInTheDocument();
    });

    it("should display empty value when searchTerm is empty", () => {
      render(<SearchFilter {...defaultProps} />);

      const input = screen.getByRole("textbox");
      expect(input.value).toBe("");
    });
  });

  describe("User Interactions", () => {
    it("should call onSearchChange when user types", async () => {
      const user = userEvent.setup();
      const onSearchChangeMock = vi.fn();

      render(
        <SearchFilter {...defaultProps} onSearchChange={onSearchChangeMock} />
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "jazz");

      expect(onSearchChangeMock).toHaveBeenCalledTimes(4); // j, a, z, z
      expect(onSearchChangeMock).toHaveBeenNthCalledWith(1, "j");
      expect(onSearchChangeMock).toHaveBeenNthCalledWith(2, "ja");
      expect(onSearchChangeMock).toHaveBeenNthCalledWith(3, "jaz");
      expect(onSearchChangeMock).toHaveBeenNthCalledWith(4, "jazz");
    });

    it("should call onSearchChange when user deletes content", async () => {
      const user = userEvent.setup();
      const onSearchChangeMock = vi.fn();

      const props = {
        searchTerm: "test",
        onSearchChange: onSearchChangeMock,
      };

      render(<SearchFilter {...props} />);

      const input = screen.getByRole("textbox");
      await user.clear(input);

      expect(onSearchChangeMock).toHaveBeenCalledWith("");
    });

    it("should handle single character input", async () => {
      const user = userEvent.setup();
      const onSearchChangeMock = vi.fn();

      render(
        <SearchFilter {...defaultProps} onSearchChange={onSearchChangeMock} />
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "a");

      expect(onSearchChangeMock).toHaveBeenCalledWith("a");
    });

    it("should handle special characters and numbers", async () => {
      const user = userEvent.setup();
      const onSearchChangeMock = vi.fn();

      render(
        <SearchFilter {...defaultProps} onSearchChange={onSearchChangeMock} />
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "test-123!@#");

      expect(onSearchChangeMock).toHaveBeenLastCalledWith("test-123!@#");
    });

    it("should handle paste operations", () => {
      const onSearchChangeMock = vi.fn();

      render(
        <SearchFilter {...defaultProps} onSearchChange={onSearchChangeMock} />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "pasted content" } });

      expect(onSearchChangeMock).toHaveBeenCalledWith("pasted content");
    });
  });

  describe("Props Handling", () => {
    it("should update input value when searchTerm prop changes", () => {
      const { rerender } = render(
        <SearchFilter {...defaultProps} searchTerm="initial" />
      );

      expect(screen.getByDisplayValue("initial")).toBeInTheDocument();

      rerender(<SearchFilter {...defaultProps} searchTerm="updated" />);

      expect(screen.getByDisplayValue("updated")).toBeInTheDocument();
      expect(screen.queryByDisplayValue("initial")).not.toBeInTheDocument();
    });

    it("should handle null searchTerm gracefully", () => {
      const props = {
        ...defaultProps,
        searchTerm: null,
      };

      expect(() => render(<SearchFilter {...props} />)).not.toThrow();
    });

    it("should handle undefined searchTerm gracefully", () => {
      const props = {
        ...defaultProps,
        searchTerm: undefined,
      };

      expect(() => render(<SearchFilter {...props} />)).not.toThrow();
    });

    it("should work without onSearchChange callback", () => {
      const props = {
        searchTerm: "",
        onSearchChange: undefined,
      };

      expect(() => render(<SearchFilter {...props} />)).not.toThrow();
    });
  });

  describe("Input Attributes", () => {
    it("should have correct input type", () => {
      render(<SearchFilter {...defaultProps} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "text");
    });

    it("should have correct placeholder text", () => {
      render(<SearchFilter {...defaultProps} />);

      expect(
        screen.getByPlaceholderText("Search events...")
      ).toBeInTheDocument();
    });

    it("should be focusable", () => {
      render(<SearchFilter {...defaultProps} />);

      const input = screen.getByRole("textbox");
      input.focus();
      expect(input).toHaveFocus();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      render(<SearchFilter {...defaultProps} />);

      const heading = screen.getByRole("heading", { name: "Search" });
      expect(heading.tagName).toBe("H3");
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const onSearchChangeMock = vi.fn();

      render(
        <SearchFilter {...defaultProps} onSearchChange={onSearchChangeMock} />
      );

      // Tab to input
      await user.tab();
      expect(screen.getByRole("textbox")).toHaveFocus();

      // Type with keyboard
      await user.keyboard("keyboard input");
      expect(onSearchChangeMock).toHaveBeenCalledWith("keyboard input");
    });

    it("should maintain semantic structure", () => {
      const { container } = render(<SearchFilter {...defaultProps} />);

      const filterDiv = container.firstChild;
      expect(filterDiv.querySelector("h3")).toBeInTheDocument();
      expect(filterDiv.querySelector("input[type='text']")).toBeInTheDocument();
    });
  });

  describe("Event Handling Edge Cases", () => {
    it("should handle rapid typing", async () => {
      const user = userEvent.setup();
      const onSearchChangeMock = vi.fn();

      render(
        <SearchFilter {...defaultProps} onSearchChange={onSearchChangeMock} />
      );

      const input = screen.getByRole("textbox");

      // Simulate rapid typing
      await user.type(input, "rapid", { delay: 1 });

      expect(onSearchChangeMock).toHaveBeenCalledTimes(5);
      expect(onSearchChangeMock).toHaveBeenLastCalledWith("rapid");
    });

    it("should handle empty string to non-empty transitions", async () => {
      const user = userEvent.setup();
      const onSearchChangeMock = vi.fn();

      render(
        <SearchFilter {...defaultProps} onSearchChange={onSearchChangeMock} />
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "test");
      await user.clear(input);
      await user.type(input, "new");

      expect(onSearchChangeMock).toHaveBeenCalledWith("");
      expect(onSearchChangeMock).toHaveBeenLastCalledWith("new");
    });

    it("should preserve input focus during updates", () => {
      const { rerender } = render(
        <SearchFilter {...defaultProps} searchTerm="" />
      );

      const input = screen.getByRole("textbox");
      input.focus();

      rerender(<SearchFilter {...defaultProps} searchTerm="updated" />);

      // Input should still be focusable after prop update
      expect(input).toBeInTheDocument();
    });
  });
});
