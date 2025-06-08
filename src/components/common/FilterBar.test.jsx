import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import FilterBar from "./FilterBar";

// Mock the CSS module
vi.mock("./FilterBar.module.css", () => ({
  default: {
    filterBar: "mock-filter-bar",
    filterBarContent: "mock-filter-bar-content",
  },
}));

describe("FilterBar", () => {
  describe("Component Rendering", () => {
    it("should render with correct structure", () => {
      render(
        <FilterBar>
          <div data-testid="child-component">Filter content</div>
        </FilterBar>
      );

      expect(screen.getByTestId("child-component")).toBeInTheDocument();
      expect(screen.getByText("Filter content")).toBeInTheDocument();
    });

    it("should have correct CSS classes applied", () => {
      const { container } = render(
        <FilterBar>
          <div>Content</div>
        </FilterBar>
      );

      expect(container.firstChild).toHaveClass("mock-filter-bar");
      expect(
        container.querySelector(".mock-filter-bar-content")
      ).toBeInTheDocument();
    });

    it("should render without children", () => {
      const { container } = render(<FilterBar />);

      expect(container.firstChild).toHaveClass("mock-filter-bar");
      expect(
        container.querySelector(".mock-filter-bar-content")
      ).toBeInTheDocument();
    });

    it("should render with null children", () => {
      const { container } = render(<FilterBar>{null}</FilterBar>);

      expect(container.firstChild).toHaveClass("mock-filter-bar");
      expect(
        container.querySelector(".mock-filter-bar-content")
      ).toBeInTheDocument();
    });
  });

  describe("Children Rendering", () => {
    it("should render single child component", () => {
      render(
        <FilterBar>
          <button>Filter Button</button>
        </FilterBar>
      );

      expect(
        screen.getByRole("button", { name: "Filter Button" })
      ).toBeInTheDocument();
    });

    it("should render multiple child components", () => {
      render(
        <FilterBar>
          <button>Button 1</button>
          <button>Button 2</button>
          <input placeholder="Search" />
        </FilterBar>
      );

      expect(
        screen.getByRole("button", { name: "Button 1" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Button 2" })
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    });

    it("should render text content", () => {
      render(<FilterBar>Just some text content</FilterBar>);

      expect(screen.getByText("Just some text content")).toBeInTheDocument();
    });

    it("should render mixed content types", () => {
      render(
        <FilterBar>
          Text before
          <span>Span content</span>
          Text after
          <div>Div content</div>
        </FilterBar>
      );

      expect(screen.getByText("Text before")).toBeInTheDocument();
      expect(screen.getByText("Span content")).toBeInTheDocument();
      expect(screen.getByText("Text after")).toBeInTheDocument();
      expect(screen.getByText("Div content")).toBeInTheDocument();
    });

    it("should preserve child component props", () => {
      render(
        <FilterBar>
          <button disabled data-testid="disabled-button">
            Disabled Button
          </button>
        </FilterBar>
      );

      const button = screen.getByTestId("disabled-button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("data-testid", "disabled-button");
    });
  });

  describe("Component Structure", () => {
    it("should maintain proper hierarchical structure", () => {
      const { container } = render(
        <FilterBar>
          <div data-testid="nested-content">Nested</div>
        </FilterBar>
      );

      const filterBar = container.firstChild;
      expect(filterBar).toHaveClass("mock-filter-bar");

      const content = filterBar.firstChild;
      expect(content).toHaveClass("mock-filter-bar-content");

      const nestedDiv = content.querySelector('[data-testid="nested-content"]');
      expect(nestedDiv).toBeInTheDocument();
      expect(nestedDiv).toHaveTextContent("Nested");
    });

    it("should wrap all children in content div", () => {
      const { container } = render(
        <FilterBar>
          <span>Child 1</span>
          <span>Child 2</span>
        </FilterBar>
      );

      const contentDiv = container.querySelector(".mock-filter-bar-content");
      expect(contentDiv.children).toHaveLength(2);
      expect(contentDiv.children[0]).toHaveTextContent("Child 1");
      expect(contentDiv.children[1]).toHaveTextContent("Child 2");
    });
  });

  describe("Component Behavior", () => {
    it("should not interfere with child component events", () => {
      const handleClick = vi.fn();

      render(
        <FilterBar>
          <button onClick={handleClick}>Clickable Button</button>
        </FilterBar>
      );

      const button = screen.getByRole("button", { name: "Clickable Button" });
      button.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not interfere with child component state", () => {
      const TestComponent = () => {
        const [count, setCount] = React.useState(0);
        return (
          <div>
            <span data-testid="count">{count}</span>
            <button onClick={() => setCount(count + 1)}>Increment</button>
          </div>
        );
      };

      render(
        <FilterBar>
          <TestComponent />
        </FilterBar>
      );

      expect(screen.getByTestId("count")).toHaveTextContent("0");

      const button = screen.getByRole("button", { name: "Increment" });
      button.click();

      expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    it("should allow child components to receive focus", () => {
      render(
        <FilterBar>
          <input data-testid="focusable-input" />
        </FilterBar>
      );

      const input = screen.getByTestId("focusable-input");
      input.focus();

      expect(input).toHaveFocus();
    });
  });

  describe("Props Handling", () => {
    it("should handle children prop changes", () => {
      const { rerender } = render(
        <FilterBar>
          <div>Original content</div>
        </FilterBar>
      );

      expect(screen.getByText("Original content")).toBeInTheDocument();
      expect(screen.queryByText("Updated content")).not.toBeInTheDocument();

      rerender(
        <FilterBar>
          <div>Updated content</div>
        </FilterBar>
      );

      expect(screen.queryByText("Original content")).not.toBeInTheDocument();
      expect(screen.getByText("Updated content")).toBeInTheDocument();
    });

    it("should handle undefined children gracefully", () => {
      const { container } = render(<FilterBar>{undefined}</FilterBar>);

      expect(container.firstChild).toHaveClass("mock-filter-bar");
      expect(
        container.querySelector(".mock-filter-bar-content")
      ).toBeInTheDocument();
    });

    it("should handle false children gracefully", () => {
      const { container } = render(<FilterBar>{false}</FilterBar>);

      expect(container.firstChild).toHaveClass("mock-filter-bar");
      expect(
        container.querySelector(".mock-filter-bar-content")
      ).toBeInTheDocument();
    });

    it("should handle conditional children", () => {
      const showButton = true;

      render(
        <FilterBar>
          {showButton && <button>Conditional Button</button>}
          <div>Always visible</div>
        </FilterBar>
      );

      expect(
        screen.getByRole("button", { name: "Conditional Button" })
      ).toBeInTheDocument();
      expect(screen.getByText("Always visible")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should not add unnecessary accessibility attributes", () => {
      const { container } = render(
        <FilterBar>
          <button>Button</button>
        </FilterBar>
      );

      const filterBar = container.firstChild;
      expect(filterBar).not.toHaveAttribute("role");
      expect(filterBar).not.toHaveAttribute("aria-label");
      expect(filterBar).not.toHaveAttribute("tabindex");
    });

    it("should preserve child accessibility attributes", () => {
      render(
        <FilterBar>
          <button aria-label="Custom label" role="button">
            Accessible Button
          </button>
        </FilterBar>
      );

      const button = screen.getByRole("button", { name: "Custom label" });
      expect(button).toHaveAttribute("aria-label", "Custom label");
      expect(button).toHaveAttribute("role", "button");
    });

    it("should maintain semantic structure for screen readers", () => {
      const { container } = render(
        <FilterBar>
          <nav aria-label="Filters">
            <button>Filter 1</button>
            <button>Filter 2</button>
          </nav>
        </FilterBar>
      );

      const nav = screen.getByRole("navigation", { name: "Filters" });
      expect(nav).toBeInTheDocument();

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });
  });

  describe("Integration with Filter Components", () => {
    it("should work with typical filter components", () => {
      const MockFilter = ({ label, onChange }) => (
        <div>
          <label>{label}</label>
          <input onChange={onChange} />
        </div>
      );

      const handleChange = vi.fn();

      render(
        <FilterBar>
          <MockFilter label="Search" onChange={handleChange} />
          <MockFilter label="Category" onChange={handleChange} />
        </FilterBar>
      );

      expect(screen.getByText("Search")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getAllByRole("textbox")).toHaveLength(2);
    });

    it("should handle complex filter layouts", () => {
      render(
        <FilterBar>
          <div className="filter-group">
            <h3>Price Range</h3>
            <input type="number" placeholder="Min" />
            <input type="number" placeholder="Max" />
          </div>
          <div className="filter-group">
            <h3>Date Range</h3>
            <input type="date" />
            <input type="date" />
          </div>
        </FilterBar>
      );

      expect(screen.getByText("Price Range")).toBeInTheDocument();
      expect(screen.getByText("Date Range")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Min")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Max")).toBeInTheDocument();
      expect(screen.getAllByDisplayValue("")).toHaveLength(4); // 2 number inputs + 2 date inputs
    });
  });

  describe("CSS Module Integration", () => {
    it("should apply mocked CSS classes correctly", () => {
      const { container } = render(
        <FilterBar>
          <div>Content</div>
        </FilterBar>
      );

      expect(container.firstChild.className).toBe("mock-filter-bar");
      expect(container.firstChild.firstChild.className).toBe(
        "mock-filter-bar-content"
      );
    });

    it("should not interfere with child component styles", () => {
      render(
        <FilterBar>
          <div className="custom-child-class" data-testid="styled-child">
            Styled child
          </div>
        </FilterBar>
      );

      const styledChild = screen.getByTestId("styled-child");
      expect(styledChild).toHaveClass("custom-child-class");
    });
  });
});
