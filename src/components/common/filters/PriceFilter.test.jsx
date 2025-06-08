import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PriceFilter from "./PriceFilter";

// Mock the CSS module
vi.mock("./Filters.module.css", () => ({
  default: {
    filter: "mock-filter",
    filterTitle: "mock-filter-title",
    priceInputs: "mock-price-inputs",
    priceField: "mock-price-field",
    priceInput: "mock-price-input",
  },
}));

describe("PriceFilter", () => {
  const defaultProps = {
    minPrice: 0,
    maxPrice: 100,
    onMinPriceChange: vi.fn(),
    onMaxPriceChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render price filter with correct structure", () => {
      render(<PriceFilter {...defaultProps} />);

      expect(
        screen.getByRole("heading", { name: "Price Range" })
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Min:")).toBeInTheDocument();
      expect(screen.getByLabelText("Max:")).toBeInTheDocument();
    });

    it("should have correct CSS classes applied", () => {
      const { container } = render(<PriceFilter {...defaultProps} />);

      expect(container.firstChild).toHaveClass("mock-filter");
      expect(screen.getByRole("heading")).toHaveClass("mock-filter-title");
      expect(container.querySelector(".mock-price-inputs")).toBeInTheDocument();
      expect(container.querySelectorAll(".mock-price-field")).toHaveLength(2);
    });

    it("should display the provided min and max prices", () => {
      const props = {
        ...defaultProps,
        minPrice: 50,
        maxPrice: 200,
      };

      render(<PriceFilter {...props} />);

      expect(screen.getByDisplayValue("50")).toBeInTheDocument();
      expect(screen.getByDisplayValue("200")).toBeInTheDocument();
    });

    it("should display default values correctly", () => {
      render(<PriceFilter {...defaultProps} />);

      const minInput = screen.getByLabelText("Min:");
      const maxInput = screen.getByLabelText("Max:");

      expect(minInput.value).toBe("0");
      expect(maxInput.value).toBe("100");
    });
  });

  describe("Input Properties", () => {
    it("should have correct input types", () => {
      render(<PriceFilter {...defaultProps} />);

      expect(screen.getByLabelText("Min:")).toHaveAttribute("type", "number");
      expect(screen.getByLabelText("Max:")).toHaveAttribute("type", "number");
    });

    it("should have correct input IDs", () => {
      render(<PriceFilter {...defaultProps} />);

      expect(screen.getByLabelText("Min:")).toHaveAttribute("id", "minPrice");
      expect(screen.getByLabelText("Max:")).toHaveAttribute("id", "maxPrice");
    });

    it("should have min attribute set to 0", () => {
      render(<PriceFilter {...defaultProps} />);

      expect(screen.getByLabelText("Min:")).toHaveAttribute("min", "0");
      expect(screen.getByLabelText("Max:")).toHaveAttribute("min", "0");
    });

    it("should have CSS classes applied to inputs", () => {
      render(<PriceFilter {...defaultProps} />);

      expect(screen.getByLabelText("Min:")).toHaveClass("mock-price-input");
      expect(screen.getByLabelText("Max:")).toHaveClass("mock-price-input");
    });
  });

  describe("User Interactions", () => {
    it("should call onMinPriceChange when min price changes", () => {
      const onMinPriceChangeMock = vi.fn();

      render(
        <PriceFilter
          {...defaultProps}
          onMinPriceChange={onMinPriceChangeMock}
        />
      );

      const minInput = screen.getByLabelText("Min:");
      fireEvent.change(minInput, { target: { value: "25" } });

      expect(onMinPriceChangeMock).toHaveBeenCalledWith(25);
    });

    it("should call onMaxPriceChange when max price changes", () => {
      const onMaxPriceChangeMock = vi.fn();

      render(
        <PriceFilter
          {...defaultProps}
          onMaxPriceChange={onMaxPriceChangeMock}
        />
      );

      const maxInput = screen.getByLabelText("Max:");
      fireEvent.change(maxInput, { target: { value: "150" } });

      expect(onMaxPriceChangeMock).toHaveBeenCalledWith(150);
    });

    it("should handle multiple price changes", () => {
      const onMinPriceChangeMock = vi.fn();
      const onMaxPriceChangeMock = vi.fn();

      render(
        <PriceFilter
          {...defaultProps}
          onMinPriceChange={onMinPriceChangeMock}
          onMaxPriceChange={onMaxPriceChangeMock}
        />
      );

      const minInput = screen.getByLabelText("Min:");
      const maxInput = screen.getByLabelText("Max:");

      fireEvent.change(minInput, { target: { value: "30" } });
      fireEvent.change(maxInput, { target: { value: "120" } });
      fireEvent.change(minInput, { target: { value: "40" } });

      expect(onMinPriceChangeMock).toHaveBeenCalledTimes(2);
      expect(onMaxPriceChangeMock).toHaveBeenCalledTimes(1);
      expect(onMinPriceChangeMock).toHaveBeenNthCalledWith(1, 30);
      expect(onMinPriceChangeMock).toHaveBeenNthCalledWith(2, 40);
      expect(onMaxPriceChangeMock).toHaveBeenCalledWith(120);
    });

    it("should handle clearing price values", () => {
      const onMinPriceChangeMock = vi.fn();
      const onMaxPriceChangeMock = vi.fn();

      const props = {
        minPrice: 50,
        maxPrice: 200,
        onMinPriceChange: onMinPriceChangeMock,
        onMaxPriceChange: onMaxPriceChangeMock,
      };

      render(<PriceFilter {...props} />);

      const minInput = screen.getByLabelText("Min:");
      const maxInput = screen.getByLabelText("Max:");

      fireEvent.change(minInput, { target: { value: "" } });
      fireEvent.change(maxInput, { target: { value: "" } });

      expect(onMinPriceChangeMock).toHaveBeenCalledWith(NaN);
      expect(onMaxPriceChangeMock).toHaveBeenCalledWith(NaN);
    });
  });

  describe("User Events", () => {
    it("should handle keyboard input", async () => {
      const user = userEvent.setup();
      const onMinPriceChangeMock = vi.fn();

      render(
        <PriceFilter
          {...defaultProps}
          onMinPriceChange={onMinPriceChangeMock}
        />
      );

      const minInput = screen.getByLabelText("Min:");
      await user.clear(minInput);
      await user.type(minInput, "75");

      expect(onMinPriceChangeMock).toHaveBeenLastCalledWith(75);
    });

    it("should be focusable with keyboard navigation", async () => {
      const user = userEvent.setup();

      render(<PriceFilter {...defaultProps} />);

      // Tab to min input
      await user.tab();
      expect(screen.getByLabelText("Min:")).toHaveFocus();

      // Tab to max input
      await user.tab();
      expect(screen.getByLabelText("Max:")).toHaveFocus();
    });
  });

  describe("Props Handling", () => {
    it("should update input values when props change", () => {
      const { rerender } = render(<PriceFilter {...defaultProps} />);

      rerender(<PriceFilter {...defaultProps} minPrice={25} maxPrice={175} />);

      expect(screen.getByDisplayValue("25")).toBeInTheDocument();
      expect(screen.getByDisplayValue("175")).toBeInTheDocument();
    });

    it("should handle null prices gracefully", () => {
      const props = {
        ...defaultProps,
        minPrice: null,
        maxPrice: null,
      };

      expect(() => render(<PriceFilter {...props} />)).not.toThrow();
    });

    it("should handle undefined prices gracefully", () => {
      const props = {
        ...defaultProps,
        minPrice: undefined,
        maxPrice: undefined,
      };

      expect(() => render(<PriceFilter {...props} />)).not.toThrow();
    });

    it("should work without callback functions", () => {
      const props = {
        minPrice: 50,
        maxPrice: 200,
        onMinPriceChange: undefined,
        onMaxPriceChange: undefined,
      };

      expect(() => render(<PriceFilter {...props} />)).not.toThrow();
    });
  });

  describe("Number Parsing", () => {
    it("should parse valid numbers correctly", () => {
      const onMinPriceChangeMock = vi.fn();

      render(
        <PriceFilter
          {...defaultProps}
          onMinPriceChange={onMinPriceChangeMock}
        />
      );

      const minInput = screen.getByLabelText("Min:");

      fireEvent.change(minInput, { target: { value: "123" } });
      expect(onMinPriceChangeMock).toHaveBeenCalledWith(123);

      fireEvent.change(minInput, { target: { value: "0" } });
      expect(onMinPriceChangeMock).toHaveBeenCalledWith(0);
    });

    it("should handle decimal numbers by parsing as integer", () => {
      const onMaxPriceChangeMock = vi.fn();

      render(
        <PriceFilter
          {...defaultProps}
          onMaxPriceChange={onMaxPriceChangeMock}
        />
      );

      const maxInput = screen.getByLabelText("Max:");
      fireEvent.change(maxInput, { target: { value: "123.45" } });

      expect(onMaxPriceChangeMock).toHaveBeenCalledWith(123);
    });

    it("should handle invalid number input", () => {
      const onMinPriceChangeMock = vi.fn();

      render(
        <PriceFilter
          {...defaultProps}
          onMinPriceChange={onMinPriceChangeMock}
        />
      );

      const minInput = screen.getByLabelText("Min:");
      fireEvent.change(minInput, { target: { value: "abc" } });

      expect(onMinPriceChangeMock).toHaveBeenCalledWith(NaN);
    });

    it("should handle negative numbers", () => {
      const onMaxPriceChangeMock = vi.fn();

      render(
        <PriceFilter
          {...defaultProps}
          onMaxPriceChange={onMaxPriceChangeMock}
        />
      );

      const maxInput = screen.getByLabelText("Max:");
      fireEvent.change(maxInput, { target: { value: "-50" } });

      expect(onMaxPriceChangeMock).toHaveBeenCalledWith(-50);
    });
  });

  describe("Accessibility", () => {
    it("should have proper label associations", () => {
      render(<PriceFilter {...defaultProps} />);

      const minInput = screen.getByLabelText("Min:");
      const maxInput = screen.getByLabelText("Max:");

      expect(minInput).toHaveAttribute("id", "minPrice");
      expect(maxInput).toHaveAttribute("id", "maxPrice");
    });

    it("should have proper heading structure", () => {
      render(<PriceFilter {...defaultProps} />);

      const heading = screen.getByRole("heading", { name: "Price Range" });
      expect(heading.tagName).toBe("H3");
    });

    it("should maintain semantic structure", () => {
      const { container } = render(<PriceFilter {...defaultProps} />);

      const filterDiv = container.firstChild;
      expect(filterDiv.querySelector("h3")).toBeInTheDocument();
      expect(filterDiv.querySelectorAll("label")).toHaveLength(2);
      expect(filterDiv.querySelectorAll("input[type='number']")).toHaveLength(
        2
      );
    });

    it("should have accessible labels", () => {
      render(<PriceFilter {...defaultProps} />);

      expect(screen.getByText("Min:")).toBeInTheDocument();
      expect(screen.getByText("Max:")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should render two number input fields", () => {
      render(<PriceFilter {...defaultProps} />);

      const numberInputs = screen.getAllByRole("spinbutton");
      expect(numberInputs).toHaveLength(2);
      expect(numberInputs.every((input) => input.type === "number")).toBe(true);
    });

    it("should maintain proper hierarchical structure", () => {
      const { container } = render(<PriceFilter {...defaultProps} />);

      const filter = container.firstChild;
      const priceInputsContainer = filter.querySelector(".mock-price-inputs");
      const priceFields =
        priceInputsContainer.querySelectorAll(".mock-price-field");

      expect(priceFields).toHaveLength(2);
      priceFields.forEach((field) => {
        expect(field.querySelector("label")).toBeInTheDocument();
        expect(field.querySelector("input[type='number']")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle very large numbers", () => {
      const onMinPriceChangeMock = vi.fn();

      render(
        <PriceFilter
          {...defaultProps}
          onMinPriceChange={onMinPriceChangeMock}
        />
      );

      const minInput = screen.getByLabelText("Min:");
      fireEvent.change(minInput, { target: { value: "999999999" } });

      expect(onMinPriceChangeMock).toHaveBeenCalledWith(999999999);
    });

    it("should handle zero values", () => {
      const onMaxPriceChangeMock = vi.fn();

      render(
        <PriceFilter
          {...defaultProps}
          onMaxPriceChange={onMaxPriceChangeMock}
        />
      );

      const maxInput = screen.getByLabelText("Max:");
      fireEvent.change(maxInput, { target: { value: "0" } });

      expect(onMaxPriceChangeMock).toHaveBeenCalledWith(0);
    });

    it("should handle scientific notation", () => {
      const onMinPriceChangeMock = vi.fn();

      render(
        <PriceFilter
          {...defaultProps}
          onMinPriceChange={onMinPriceChangeMock}
        />
      );

      const minInput = screen.getByLabelText("Min:");
      fireEvent.change(minInput, { target: { value: "1e3" } });

      expect(onMinPriceChangeMock).toHaveBeenCalledWith(1000);
    });
  });
});
