import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FilterBar from "./FilterBar";

describe("FilterBar", () => {
  it("renders without crashing", () => {
    render(<FilterBar />);
  });

  it("renders children correctly", () => {
    render(
      <FilterBar>
        <div>Test Child</div>
      </FilterBar>
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    const { container } = render(
      <FilterBar>
        <span>Content</span>
      </FilterBar>
    );

    const filterBar = container.firstChild;
    const filterContent = filterBar.firstChild;

    expect(filterBar.className).toMatch(/filterBar/);
    expect(filterContent.className).toMatch(/filterBarContent/);
  });

  it("handles multiple children", () => {
    render(
      <FilterBar>
        <button>Button 1</button>
        <button>Button 2</button>
        <input placeholder="Search" />
      </FilterBar>
    );

    expect(screen.getByText("Button 1")).toBeInTheDocument();
    expect(screen.getByText("Button 2")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("handles no children", () => {
    const { container } = render(<FilterBar />);

    const filterBar = container.firstChild;
    const filterContent = filterBar.firstChild;

    expect(filterBar).toBeInTheDocument();
    expect(filterContent).toBeInTheDocument();
    expect(filterContent.textContent).toBe("");
  });
});
