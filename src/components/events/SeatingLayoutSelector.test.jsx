import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SeatingLayoutSelector from "./SeatingLayoutSelector";

// Mock the CSS module
vi.mock("./SeatingLayoutSelector.module.css", () => ({
  default: {
    seatLayoutContainer: "mock-seat-layout-container",
    seatLayout: "mock-seat-layout",
    row: "mock-row",
    seat: "mock-seat",
    standardSeat: "mock-standard-seat",
    vipSeat: "mock-vip-seat",
    selectedSeat: "mock-selected-seat",
    unavailableSeat: "mock-unavailable-seat",
    controls: "mock-controls",
    legend: "mock-legend",
    buyButton: "mock-buy-button",
  },
}));

// Mock console.log to avoid test output clutter
vi.spyOn(console, "log").mockImplementation(() => {});
vi.spyOn(console, "error").mockImplementation(() => {});
vi.spyOn(console, "warn").mockImplementation(() => {});

describe("SeatingLayoutSelector", () => {
  const mockTicketTypes = [
    {
      ticket_type_id: 1,
      name: "VIP Ticket",
      price: 150,
    },
    {
      ticket_type_id: 2,
      name: "Standard Ticket",
      price: 80,
    },
  ];

  const defaultProps = {
    eventId: "test-event-123",
    category: "4F+2",
    ticketTypes: mockTicketTypes,
    onAddToCart: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render loading state initially", () => {
      render(<SeatingLayoutSelector {...defaultProps} />);

      expect(screen.getByText("Loading seating layout...")).toBeInTheDocument();
    });

    it("should render error when category is missing", () => {
      const props = { ...defaultProps, category: null };

      render(<SeatingLayoutSelector {...props} />);

      expect(
        screen.getByText("Seating layout or ticket information is missing.")
      ).toBeInTheDocument();
    });

    it("should render error when ticketTypes are missing", () => {
      const props = { ...defaultProps, ticketTypes: [] };

      render(<SeatingLayoutSelector {...props} />);

      expect(
        screen.getByText("Seating layout or ticket information is missing.")
      ).toBeInTheDocument();
    });

    it("should render error for invalid category format", () => {
      const props = { ...defaultProps, category: "invalid" };

      render(<SeatingLayoutSelector {...props} />);

      expect(
        screen.getByText(
          "Invalid category format. Expected format like '4F' or '7J+2'."
        )
      ).toBeInTheDocument();
    });

    it("should render seating layout for valid props", async () => {
      render(<SeatingLayoutSelector {...defaultProps} />);

      // Wait for loading to complete
      await screen.findByText("Buy Selected Tickets");

      // Should show seat layout
      expect(screen.getByText("Buy Selected Tickets")).toBeInTheDocument();
    });
  });

  describe("Category Parsing", () => {
    it("should handle category without VIP rows", async () => {
      const props = { ...defaultProps, category: "3C" };

      render(<SeatingLayoutSelector {...props} />);

      await screen.findByText("Buy Selected Tickets");
      expect(screen.getByText("Buy Selected Tickets")).toBeInTheDocument();
    });

    it("should handle category with VIP rows", async () => {
      const props = { ...defaultProps, category: "5E+3" };

      render(<SeatingLayoutSelector {...props} />);

      await screen.findByText("Buy Selected Tickets");
      expect(screen.getByText("Buy Selected Tickets")).toBeInTheDocument();
    });

    it("should handle single row category", async () => {
      const props = { ...defaultProps, category: "1A" };

      render(<SeatingLayoutSelector {...props} />);

      await screen.findByText("Buy Selected Tickets");
      expect(screen.getByText("Buy Selected Tickets")).toBeInTheDocument();
    });
  });

  describe("Ticket Type Handling", () => {
    it("should render error when VIP ticket type is missing", () => {
      const props = {
        ...defaultProps,
        ticketTypes: [
          { ticket_type_id: 2, name: "Standard Ticket", price: 80 },
        ],
      };

      render(<SeatingLayoutSelector {...props} />);

      expect(
        screen.getByText(
          "Could not find both VIP and Standard ticket types based on names."
        )
      ).toBeInTheDocument();
    });

    it("should render error when Standard ticket type is missing", () => {
      const props = {
        ...defaultProps,
        ticketTypes: [{ ticket_type_id: 1, name: "VIP Ticket", price: 150 }],
      };

      render(<SeatingLayoutSelector {...props} />);

      expect(
        screen.getByText(
          "Could not find both VIP and Standard ticket types based on names."
        )
      ).toBeInTheDocument();
    });

    it("should work with alternative ticket type naming", async () => {
      const alternativeTicketTypes = [
        { id: 1, name: "Premium VIP Experience", price: 200 },
        { id: 2, name: "Regular Admission", price: 60 },
      ];

      const props = { ...defaultProps, ticketTypes: alternativeTicketTypes };

      render(<SeatingLayoutSelector {...props} />);

      await screen.findByText("Buy Selected Tickets");
      expect(screen.getByText("Buy Selected Tickets")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle missing eventId", async () => {
      const props = { ...defaultProps, eventId: null };

      render(<SeatingLayoutSelector {...props} />);

      await screen.findByText("Buy Selected Tickets");
      expect(screen.getByText("Buy Selected Tickets")).toBeInTheDocument();
    });

    it("should handle missing onAddToCart prop", async () => {
      const props = { ...defaultProps, onAddToCart: null };

      render(<SeatingLayoutSelector {...props} />);

      await screen.findByText("Buy Selected Tickets");
      expect(screen.getByText("Buy Selected Tickets")).toBeInTheDocument();
    });

    it("should handle undefined props gracefully", () => {
      const props = {
        eventId: undefined,
        category: undefined,
        ticketTypes: undefined,
        onAddToCart: undefined,
      };

      expect(() => render(<SeatingLayoutSelector {...props} />)).not.toThrow();
    });
  });

  describe("Component State", () => {
    it("should show loading state initially", () => {
      render(<SeatingLayoutSelector {...defaultProps} />);

      expect(screen.getByText("Loading seating layout...")).toBeInTheDocument();
    });

    it("should transition from loading to loaded state", async () => {
      render(<SeatingLayoutSelector {...defaultProps} />);

      // Initially loading
      expect(screen.getByText("Loading seating layout...")).toBeInTheDocument();

      // Then loaded
      await screen.findByText("Buy Selected Tickets");
      expect(screen.getByText("Buy Selected Tickets")).toBeInTheDocument();
      expect(
        screen.queryByText("Loading seating layout...")
      ).not.toBeInTheDocument();
    });
  });

  describe("Props Updates", () => {
    it("should re-render when category changes", () => {
      const { rerender } = render(<SeatingLayoutSelector {...defaultProps} />);

      expect(screen.getByText("Loading seating layout...")).toBeInTheDocument();

      rerender(<SeatingLayoutSelector {...defaultProps} category="6G+1" />);

      expect(screen.getByText("Loading seating layout...")).toBeInTheDocument();
    });

    it("should re-render when ticketTypes change", () => {
      const { rerender } = render(<SeatingLayoutSelector {...defaultProps} />);

      const newTicketTypes = [
        { ticket_type_id: 3, name: "VIP Premium", price: 200 },
        { ticket_type_id: 4, name: "Standard Plus", price: 100 },
      ];

      rerender(
        <SeatingLayoutSelector {...defaultProps} ticketTypes={newTicketTypes} />
      );

      expect(screen.getByText("Loading seating layout...")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty category string", () => {
      const props = { ...defaultProps, category: "" };

      render(<SeatingLayoutSelector {...props} />);

      expect(
        screen.getByText("Seating layout or ticket information is missing.")
      ).toBeInTheDocument();
    });

    it("should handle null ticketTypes", () => {
      const props = { ...defaultProps, ticketTypes: null };

      render(<SeatingLayoutSelector {...props} />);

      expect(
        screen.getByText("Seating layout or ticket information is missing.")
      ).toBeInTheDocument();
    });

    it("should handle category with zero rows", () => {
      const props = { ...defaultProps, category: "0A" };

      render(<SeatingLayoutSelector {...props} />);

      expect(
        screen.getByText("Invalid row or column values from category.")
      ).toBeInTheDocument();
    });

    it("should handle category with invalid column", () => {
      const props = { ...defaultProps, category: "4@" };

      render(<SeatingLayoutSelector {...props} />);

      expect(
        screen.getByText(
          "Invalid category format. Expected format like '4F' or '7J+2'."
        )
      ).toBeInTheDocument();
    });
  });

  describe("Console Logging", () => {
    it("should log component render", () => {
      render(<SeatingLayoutSelector {...defaultProps} />);

      expect(console.log).toHaveBeenCalledWith(
        "[SeatingLayoutSelector] Component rendered with props:",
        expect.objectContaining({
          eventId: "test-event-123",
          category: "4F+2",
          ticketTypes: mockTicketTypes,
        })
      );
    });

    it("should log useEffect start", () => {
      render(<SeatingLayoutSelector {...defaultProps} />);

      expect(console.log).toHaveBeenCalledWith(
        "[SeatingLayoutSelector] useEffect triggered."
      );
    });
  });
});
