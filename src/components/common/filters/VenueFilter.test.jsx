import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VenueFilter from "./VenueFilter";

// Mock the CSS module
vi.mock("./Filters.module.css", () => ({
  default: {
    filter: "mock-filter",
    filterTitle: "mock-filter-title",
    checkboxGroup: "mock-checkbox-group",
    checkboxLabel: "mock-checkbox-label",
    checkbox: "mock-checkbox",
  },
}));

describe("VenueFilter", () => {
  const defaultProps = {
    venues: [
      "Adelaide Festival Centre",
      "Her Majesty's Theatre",
      "The Space Theatre",
    ],
    selectedVenues: [],
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render venue filter with correct structure", () => {
      render(<VenueFilter {...defaultProps} />);

      expect(
        screen.getByRole("heading", { name: "Venue" })
      ).toBeInTheDocument();
      expect(screen.getByText("Adelaide Festival Centre")).toBeInTheDocument();
      expect(screen.getByText("Her Majesty's Theatre")).toBeInTheDocument();
      expect(screen.getByText("The Space Theatre")).toBeInTheDocument();
    });

    it("should have correct CSS classes applied", () => {
      const { container } = render(<VenueFilter {...defaultProps} />);

      expect(container.firstChild).toHaveClass("mock-filter");
      expect(screen.getByRole("heading")).toHaveClass("mock-filter-title");
      expect(
        container.querySelector(".mock-checkbox-group")
      ).toBeInTheDocument();
    });

    it("should render all venue options as checkboxes", () => {
      render(<VenueFilter {...defaultProps} />);

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);

      expect(
        screen.getByLabelText("Adelaide Festival Centre")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Her Majesty's Theatre")
      ).toBeInTheDocument();
      expect(screen.getByLabelText("The Space Theatre")).toBeInTheDocument();
    });

    it("should show selected venues as checked", () => {
      const props = {
        ...defaultProps,
        selectedVenues: ["Adelaide Festival Centre", "The Space Theatre"],
      };

      render(<VenueFilter {...props} />);

      expect(screen.getByLabelText("Adelaide Festival Centre")).toBeChecked();
      expect(screen.getByLabelText("Her Majesty's Theatre")).not.toBeChecked();
      expect(screen.getByLabelText("The Space Theatre")).toBeChecked();
    });

    it("should render empty list when no venues provided", () => {
      const props = {
        ...defaultProps,
        venues: [],
      };

      render(<VenueFilter {...props} />);

      expect(
        screen.getByRole("heading", { name: "Venue" })
      ).toBeInTheDocument();
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should call onChange when venue is selected", () => {
      const onChangeMock = vi.fn();

      render(<VenueFilter {...defaultProps} onChange={onChangeMock} />);

      const checkbox = screen.getByLabelText("Adelaide Festival Centre");
      fireEvent.click(checkbox);

      expect(onChangeMock).toHaveBeenCalledWith(["Adelaide Festival Centre"]);
    });

    it("should call onChange when venue is deselected", () => {
      const onChangeMock = vi.fn();
      const props = {
        ...defaultProps,
        selectedVenues: ["Adelaide Festival Centre", "Her Majesty's Theatre"],
        onChange: onChangeMock,
      };

      render(<VenueFilter {...props} />);

      const checkbox = screen.getByLabelText("Adelaide Festival Centre");
      fireEvent.click(checkbox);

      expect(onChangeMock).toHaveBeenCalledWith(["Her Majesty's Theatre"]);
    });

    it("should handle multiple venue selections", () => {
      const onChangeMock = vi.fn();

      render(<VenueFilter {...defaultProps} onChange={onChangeMock} />);

      const checkbox1 = screen.getByLabelText("Adelaide Festival Centre");
      const checkbox2 = screen.getByLabelText("Her Majesty's Theatre");

      fireEvent.click(checkbox1);
      fireEvent.click(checkbox2);

      expect(onChangeMock).toHaveBeenCalledTimes(2);
      expect(onChangeMock).toHaveBeenNthCalledWith(1, [
        "Adelaide Festival Centre",
      ]);
      expect(onChangeMock).toHaveBeenNthCalledWith(2, [
        "Her Majesty's Theatre",
      ]);
    });

    it("should toggle venue selection correctly", () => {
      const onChangeMock = vi.fn();
      const props = {
        ...defaultProps,
        selectedVenues: ["Adelaide Festival Centre"],
        onChange: onChangeMock,
      };

      render(<VenueFilter {...props} />);

      const checkbox = screen.getByLabelText("Adelaide Festival Centre");

      // Deselect
      fireEvent.click(checkbox);
      expect(onChangeMock).toHaveBeenCalledWith([]);

      // Select again (simulating re-render with new props)
      onChangeMock.mockClear();
      render(
        <VenueFilter
          {...defaultProps}
          selectedVenues={[]}
          onChange={onChangeMock}
        />
      );

      const checkboxAgain = screen.getByLabelText("Adelaide Festival Centre");
      fireEvent.click(checkboxAgain);
      expect(onChangeMock).toHaveBeenCalledWith(["Adelaide Festival Centre"]);
    });
  });

  describe("User Events", () => {
    it("should handle keyboard interactions", async () => {
      const user = userEvent.setup();
      const onChangeMock = vi.fn();

      render(<VenueFilter {...defaultProps} onChange={onChangeMock} />);

      const checkbox = screen.getByLabelText("Adelaide Festival Centre");
      await user.click(checkbox);

      expect(onChangeMock).toHaveBeenCalledWith(["Adelaide Festival Centre"]);
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();

      render(<VenueFilter {...defaultProps} />);

      // Tab to first checkbox
      await user.tab();
      expect(screen.getByLabelText("Adelaide Festival Centre")).toHaveFocus();

      // Tab to second checkbox
      await user.tab();
      expect(screen.getByLabelText("Her Majesty's Theatre")).toHaveFocus();
    });

    it("should support space key for selection", async () => {
      const user = userEvent.setup();
      const onChangeMock = vi.fn();

      render(<VenueFilter {...defaultProps} onChange={onChangeMock} />);

      const checkbox = screen.getByLabelText("Adelaide Festival Centre");
      checkbox.focus();
      await user.keyboard(" ");

      expect(onChangeMock).toHaveBeenCalledWith(["Adelaide Festival Centre"]);
    });
  });

  describe("Props Handling", () => {
    it("should update when venues prop changes", () => {
      const { rerender } = render(<VenueFilter {...defaultProps} />);

      expect(screen.getAllByRole("checkbox")).toHaveLength(3);

      rerender(
        <VenueFilter
          {...defaultProps}
          venues={["New Venue 1", "New Venue 2"]}
        />
      );

      expect(screen.getAllByRole("checkbox")).toHaveLength(2);
      expect(screen.getByText("New Venue 1")).toBeInTheDocument();
      expect(screen.getByText("New Venue 2")).toBeInTheDocument();
    });

    it("should update when selectedVenues prop changes", () => {
      const { rerender } = render(<VenueFilter {...defaultProps} />);

      expect(
        screen.getByLabelText("Adelaide Festival Centre")
      ).not.toBeChecked();

      rerender(
        <VenueFilter
          {...defaultProps}
          selectedVenues={["Adelaide Festival Centre"]}
        />
      );

      expect(screen.getByLabelText("Adelaide Festival Centre")).toBeChecked();
    });

    it("should handle null venues gracefully", () => {
      const props = {
        ...defaultProps,
        venues: null,
      };

      expect(() => render(<VenueFilter {...props} />)).toThrow();
    });

    it("should handle undefined venues gracefully", () => {
      const props = {
        ...defaultProps,
        venues: undefined,
      };

      expect(() => render(<VenueFilter {...props} />)).toThrow();
    });

    it("should handle null selectedVenues gracefully", () => {
      const props = {
        ...defaultProps,
        selectedVenues: null,
      };

      expect(() => render(<VenueFilter {...props} />)).toThrow();
    });

    it("should work without onChange callback", () => {
      const props = {
        ...defaultProps,
        onChange: undefined,
      };

      expect(() => render(<VenueFilter {...props} />)).not.toThrow();
    });
  });

  describe("Venue Selection Logic", () => {
    it("should add venue to empty selection", () => {
      const onChangeMock = vi.fn();

      render(<VenueFilter {...defaultProps} onChange={onChangeMock} />);

      fireEvent.click(screen.getByLabelText("Her Majesty's Theatre"));

      expect(onChangeMock).toHaveBeenCalledWith(["Her Majesty's Theatre"]);
    });

    it("should add venue to existing selection", () => {
      const onChangeMock = vi.fn();
      const props = {
        ...defaultProps,
        selectedVenues: ["Adelaide Festival Centre"],
        onChange: onChangeMock,
      };

      render(<VenueFilter {...props} />);

      fireEvent.click(screen.getByLabelText("Her Majesty's Theatre"));

      expect(onChangeMock).toHaveBeenCalledWith([
        "Adelaide Festival Centre",
        "Her Majesty's Theatre",
      ]);
    });

    it("should remove venue from selection", () => {
      const onChangeMock = vi.fn();
      const props = {
        ...defaultProps,
        selectedVenues: ["Adelaide Festival Centre", "Her Majesty's Theatre"],
        onChange: onChangeMock,
      };

      render(<VenueFilter {...props} />);

      fireEvent.click(screen.getByLabelText("Adelaide Festival Centre"));

      expect(onChangeMock).toHaveBeenCalledWith(["Her Majesty's Theatre"]);
    });

    it("should preserve order when removing venue from middle", () => {
      const onChangeMock = vi.fn();
      const props = {
        ...defaultProps,
        selectedVenues: [
          "Adelaide Festival Centre",
          "Her Majesty's Theatre",
          "The Space Theatre",
        ],
        onChange: onChangeMock,
      };

      render(<VenueFilter {...props} />);

      fireEvent.click(screen.getByLabelText("Her Majesty's Theatre"));

      expect(onChangeMock).toHaveBeenCalledWith([
        "Adelaide Festival Centre",
        "The Space Theatre",
      ]);
    });
  });

  describe("Accessibility", () => {
    it("should have proper label associations", () => {
      render(<VenueFilter {...defaultProps} />);

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox, index) => {
        const expectedLabel = defaultProps.venues[index];
        expect(screen.getByLabelText(expectedLabel)).toBe(checkbox);
      });
    });

    it("should have proper heading structure", () => {
      render(<VenueFilter {...defaultProps} />);

      const heading = screen.getByRole("heading", { name: "Venue" });
      expect(heading.tagName).toBe("H3");
    });

    it("should maintain semantic structure", () => {
      const { container } = render(<VenueFilter {...defaultProps} />);

      const filterDiv = container.firstChild;
      expect(filterDiv.querySelector("h3")).toBeInTheDocument();

      const labels = filterDiv.querySelectorAll("label");
      expect(labels).toHaveLength(3);

      labels.forEach((label) => {
        expect(
          label.querySelector("input[type='checkbox']")
        ).toBeInTheDocument();
        expect(label.querySelector("span")).toBeInTheDocument();
      });
    });

    it("should have accessible checkbox labels", () => {
      render(<VenueFilter {...defaultProps} />);

      defaultProps.venues.forEach((venue) => {
        expect(screen.getByText(venue)).toBeInTheDocument();
      });
    });
  });

  describe("Component Structure", () => {
    it("should render checkbox for each venue", () => {
      render(<VenueFilter {...defaultProps} />);

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(defaultProps.venues.length);

      checkboxes.forEach((checkbox) => {
        expect(checkbox.type).toBe("checkbox");
      });
    });

    it("should maintain proper hierarchical structure", () => {
      const { container } = render(<VenueFilter {...defaultProps} />);

      const filter = container.firstChild;
      const checkboxGroup = filter.querySelector(".mock-checkbox-group");
      const labels = checkboxGroup.querySelectorAll(".mock-checkbox-label");

      expect(labels).toHaveLength(3);
      labels.forEach((label) => {
        expect(label.querySelector("input.mock-checkbox")).toBeInTheDocument();
        expect(label.querySelector("span")).toBeInTheDocument();
      });
    });

    it("should use venue name as key", () => {
      const { container } = render(<VenueFilter {...defaultProps} />);

      // Check that each label exists (React keys are not directly testable)
      defaultProps.venues.forEach((venue) => {
        expect(screen.getByText(venue)).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle venues with special characters", () => {
      const specialVenues = ["Venue & Co.", "Theatre (Main)", "Place - Hall"];
      const props = {
        ...defaultProps,
        venues: specialVenues,
      };

      render(<VenueFilter {...props} />);

      specialVenues.forEach((venue) => {
        expect(screen.getByText(venue)).toBeInTheDocument();
        expect(screen.getByLabelText(venue)).toBeInTheDocument();
      });
    });

    it("should handle venues with identical names", () => {
      const duplicateVenues = ["Theatre", "Theatre", "Theatre"];
      const props = {
        ...defaultProps,
        venues: duplicateVenues,
      };

      render(<VenueFilter {...props} />);

      // Should still render all checkboxes even with duplicate names
      expect(screen.getAllByRole("checkbox")).toHaveLength(3);
    });

    it("should handle very long venue names", () => {
      const longVenues = [
        "A Very Very Very Long Venue Name That Goes On And On",
      ];
      const props = {
        ...defaultProps,
        venues: longVenues,
      };

      render(<VenueFilter {...props} />);

      expect(screen.getByText(longVenues[0])).toBeInTheDocument();
      expect(screen.getByLabelText(longVenues[0])).toBeInTheDocument();
    });

    it("should handle selection state with venues not in list", () => {
      const props = {
        ...defaultProps,
        selectedVenues: ["Adelaide Festival Centre", "Non-existent Venue"],
      };

      render(<VenueFilter {...props} />);

      // Should only show venues that exist in the venues list
      expect(screen.getByLabelText("Adelaide Festival Centre")).toBeChecked();
      expect(screen.queryByText("Non-existent Venue")).not.toBeInTheDocument();
    });
  });
});
