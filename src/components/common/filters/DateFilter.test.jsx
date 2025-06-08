import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DateFilter from "./DateFilter";

// Mock the CSS module
vi.mock("./Filters.module.css", () => ({
  default: {
    filter: "mock-filter",
    filterTitle: "mock-filter-title",
    dateInputs: "mock-date-inputs",
    dateField: "mock-date-field",
    dateInput: "mock-date-input",
  },
}));

describe("DateFilter", () => {
  const defaultProps = {
    startDate: "",
    endDate: "",
    onStartDateChange: vi.fn(),
    onEndDateChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render date filter with correct structure", () => {
      render(<DateFilter {...defaultProps} />);

      expect(
        screen.getByRole("heading", { name: "Date Range" })
      ).toBeInTheDocument();
      expect(screen.getByLabelText("From:")).toBeInTheDocument();
      expect(screen.getByLabelText("To:")).toBeInTheDocument();
    });

    it("should have correct CSS classes applied", () => {
      const { container } = render(<DateFilter {...defaultProps} />);

      expect(container.firstChild).toHaveClass("mock-filter");
      expect(screen.getByRole("heading")).toHaveClass("mock-filter-title");
      expect(container.querySelector(".mock-date-inputs")).toBeInTheDocument();
      expect(container.querySelectorAll(".mock-date-field")).toHaveLength(2);
    });

    it("should display the provided start and end dates", () => {
      const props = {
        ...defaultProps,
        startDate: "2024-01-15",
        endDate: "2024-01-20",
      };

      render(<DateFilter {...props} />);

      expect(screen.getByDisplayValue("2024-01-15")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2024-01-20")).toBeInTheDocument();
    });

    it("should display empty values when dates are empty", () => {
      render(<DateFilter {...defaultProps} />);

      const startDateInput = screen.getByLabelText("From:");
      const endDateInput = screen.getByLabelText("To:");

      expect(startDateInput.value).toBe("");
      expect(endDateInput.value).toBe("");
    });
  });

  describe("Input Properties", () => {
    it("should have correct input types", () => {
      render(<DateFilter {...defaultProps} />);

      expect(screen.getByLabelText("From:")).toHaveAttribute("type", "date");
      expect(screen.getByLabelText("To:")).toHaveAttribute("type", "date");
    });

    it("should have correct input IDs", () => {
      render(<DateFilter {...defaultProps} />);

      expect(screen.getByLabelText("From:")).toHaveAttribute("id", "startDate");
      expect(screen.getByLabelText("To:")).toHaveAttribute("id", "endDate");
    });

    it("should have CSS classes applied to inputs", () => {
      render(<DateFilter {...defaultProps} />);

      expect(screen.getByLabelText("From:")).toHaveClass("mock-date-input");
      expect(screen.getByLabelText("To:")).toHaveClass("mock-date-input");
    });
  });

  describe("User Interactions", () => {
    it("should call onStartDateChange when start date changes", () => {
      const onStartDateChangeMock = vi.fn();

      render(
        <DateFilter
          {...defaultProps}
          onStartDateChange={onStartDateChangeMock}
        />
      );

      const startDateInput = screen.getByLabelText("From:");
      fireEvent.change(startDateInput, { target: { value: "2024-01-15" } });

      expect(onStartDateChangeMock).toHaveBeenCalledWith("2024-01-15");
    });

    it("should call onEndDateChange when end date changes", () => {
      const onEndDateChangeMock = vi.fn();

      render(
        <DateFilter {...defaultProps} onEndDateChange={onEndDateChangeMock} />
      );

      const endDateInput = screen.getByLabelText("To:");
      fireEvent.change(endDateInput, { target: { value: "2024-01-20" } });

      expect(onEndDateChangeMock).toHaveBeenCalledWith("2024-01-20");
    });

    it("should handle multiple date changes", () => {
      const onStartDateChangeMock = vi.fn();
      const onEndDateChangeMock = vi.fn();

      render(
        <DateFilter
          {...defaultProps}
          onStartDateChange={onStartDateChangeMock}
          onEndDateChange={onEndDateChangeMock}
        />
      );

      const startDateInput = screen.getByLabelText("From:");
      const endDateInput = screen.getByLabelText("To:");

      fireEvent.change(startDateInput, { target: { value: "2024-01-15" } });
      fireEvent.change(endDateInput, { target: { value: "2024-01-20" } });
      fireEvent.change(startDateInput, { target: { value: "2024-01-10" } });

      expect(onStartDateChangeMock).toHaveBeenCalledTimes(2);
      expect(onEndDateChangeMock).toHaveBeenCalledTimes(1);
      expect(onStartDateChangeMock).toHaveBeenNthCalledWith(1, "2024-01-15");
      expect(onStartDateChangeMock).toHaveBeenNthCalledWith(2, "2024-01-10");
      expect(onEndDateChangeMock).toHaveBeenCalledWith("2024-01-20");
    });

    it("should handle clearing dates", () => {
      const onStartDateChangeMock = vi.fn();
      const onEndDateChangeMock = vi.fn();

      const props = {
        startDate: "2024-01-15",
        endDate: "2024-01-20",
        onStartDateChange: onStartDateChangeMock,
        onEndDateChange: onEndDateChangeMock,
      };

      render(<DateFilter {...props} />);

      const startDateInput = screen.getByLabelText("From:");
      const endDateInput = screen.getByLabelText("To:");

      fireEvent.change(startDateInput, { target: { value: "" } });
      fireEvent.change(endDateInput, { target: { value: "" } });

      expect(onStartDateChangeMock).toHaveBeenCalledWith("");
      expect(onEndDateChangeMock).toHaveBeenCalledWith("");
    });
  });

  describe("User Events", () => {
    it("should handle keyboard date input", async () => {
      const user = userEvent.setup();
      const onStartDateChangeMock = vi.fn();

      render(
        <DateFilter
          {...defaultProps}
          onStartDateChange={onStartDateChangeMock}
        />
      );

      const startDateInput = screen.getByLabelText("From:");
      await user.type(startDateInput, "2024-01-15");

      // Date input behavior varies by browser, so we just check it was called
      expect(onStartDateChangeMock).toHaveBeenCalled();
    });

    it("should be focusable with keyboard navigation", async () => {
      const user = userEvent.setup();

      render(<DateFilter {...defaultProps} />);

      // Tab to first input
      await user.tab();
      expect(screen.getByLabelText("From:")).toHaveFocus();

      // Tab to second input
      await user.tab();
      expect(screen.getByLabelText("To:")).toHaveFocus();
    });
  });

  describe("Props Handling", () => {
    it("should update input values when props change", () => {
      const { rerender } = render(<DateFilter {...defaultProps} />);

      rerender(
        <DateFilter
          {...defaultProps}
          startDate="2024-01-15"
          endDate="2024-01-20"
        />
      );

      expect(screen.getByDisplayValue("2024-01-15")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2024-01-20")).toBeInTheDocument();
    });

    it("should handle null dates gracefully", () => {
      const props = {
        ...defaultProps,
        startDate: null,
        endDate: null,
      };

      expect(() => render(<DateFilter {...props} />)).not.toThrow();
    });

    it("should handle undefined dates gracefully", () => {
      const props = {
        ...defaultProps,
        startDate: undefined,
        endDate: undefined,
      };

      expect(() => render(<DateFilter {...props} />)).not.toThrow();
    });

    it("should work without callback functions", () => {
      const props = {
        startDate: "2024-01-15",
        endDate: "2024-01-20",
        onStartDateChange: undefined,
        onEndDateChange: undefined,
      };

      expect(() => render(<DateFilter {...props} />)).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("should have proper label associations", () => {
      render(<DateFilter {...defaultProps} />);

      const startDateInput = screen.getByLabelText("From:");
      const endDateInput = screen.getByLabelText("To:");

      expect(startDateInput).toHaveAttribute("id", "startDate");
      expect(endDateInput).toHaveAttribute("id", "endDate");
    });

    it("should have proper heading structure", () => {
      render(<DateFilter {...defaultProps} />);

      const heading = screen.getByRole("heading", { name: "Date Range" });
      expect(heading.tagName).toBe("H3");
    });

    it("should maintain semantic structure", () => {
      const { container } = render(<DateFilter {...defaultProps} />);

      const filterDiv = container.firstChild;
      expect(filterDiv.querySelector("h3")).toBeInTheDocument();
      expect(filterDiv.querySelectorAll("label")).toHaveLength(2);
      expect(filterDiv.querySelectorAll("input[type='date']")).toHaveLength(2);
    });

    it("should have accessible labels", () => {
      render(<DateFilter {...defaultProps} />);

      expect(screen.getByText("From:")).toBeInTheDocument();
      expect(screen.getByText("To:")).toBeInTheDocument();
    });
  });

  describe("Date Validation", () => {
    it("should handle invalid date formats", () => {
      const onStartDateChangeMock = vi.fn();

      render(
        <DateFilter
          {...defaultProps}
          onStartDateChange={onStartDateChangeMock}
        />
      );

      const startDateInput = screen.getByLabelText("From:");
      fireEvent.change(startDateInput, { target: { value: "invalid-date" } });

      expect(onStartDateChangeMock).toHaveBeenCalledWith("invalid-date");
    });

    it("should handle future dates", () => {
      const futureDate = "2030-12-31";
      const onStartDateChangeMock = vi.fn();

      render(
        <DateFilter
          {...defaultProps}
          onStartDateChange={onStartDateChangeMock}
        />
      );

      const startDateInput = screen.getByLabelText("From:");
      fireEvent.change(startDateInput, { target: { value: futureDate } });

      expect(onStartDateChangeMock).toHaveBeenCalledWith(futureDate);
    });

    it("should handle past dates", () => {
      const pastDate = "2020-01-01";
      const onEndDateChangeMock = vi.fn();

      render(
        <DateFilter {...defaultProps} onEndDateChange={onEndDateChangeMock} />
      );

      const endDateInput = screen.getByLabelText("To:");
      fireEvent.change(endDateInput, { target: { value: pastDate } });

      expect(onEndDateChangeMock).toHaveBeenCalledWith(pastDate);
    });
  });

  describe("Component Structure", () => {
    it("should render two date input fields", () => {
      render(<DateFilter {...defaultProps} />);

      const dateInputs = screen.getAllByDisplayValue("");
      expect(dateInputs).toHaveLength(2);
      expect(dateInputs.every((input) => input.type === "date")).toBe(true);
    });

    it("should maintain proper hierarchical structure", () => {
      const { container } = render(<DateFilter {...defaultProps} />);

      const filter = container.firstChild;
      const dateInputsContainer = filter.querySelector(".mock-date-inputs");
      const dateFields =
        dateInputsContainer.querySelectorAll(".mock-date-field");

      expect(dateFields).toHaveLength(2);
      dateFields.forEach((field) => {
        expect(field.querySelector("label")).toBeInTheDocument();
        expect(field.querySelector("input[type='date']")).toBeInTheDocument();
      });
    });
  });
});
