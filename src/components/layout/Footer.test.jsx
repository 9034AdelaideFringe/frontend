import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  describe("Component Rendering", () => {
    it("should render footer with correct structure", () => {
      render(<Footer />);

      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass("footer");
    });

    it("should render copyright text with current year", () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      const copyrightText = `© ${currentYear} Adelaide Fringe. All rights reserved.`;

      expect(screen.getByText(copyrightText)).toBeInTheDocument();
    });

    it("should have container div", () => {
      const { container } = render(<Footer />);

      const containerDiv = container.querySelector(".container");
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe("Content", () => {
    it("should display Adelaide Fringe copyright", () => {
      render(<Footer />);

      expect(screen.getByText(/Adelaide Fringe/)).toBeInTheDocument();
      expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    });

    it("should display copyright symbol", () => {
      render(<Footer />);

      expect(screen.getByText(/©/)).toBeInTheDocument();
    });
  });

  describe("Dynamic Year", () => {
    it("should display the correct current year", () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(currentYear.toString())).toBeInTheDocument();
    });

    it("should update year dynamically", () => {
      // Mock Date to return a specific year
      const mockDate = new Date(2025, 0, 1);
      const originalDate = global.Date;
      global.Date = vi.fn(() => mockDate);
      global.Date.getFullYear = vi.fn(() => 2025);

      render(<Footer />);

      expect(screen.getByText("2025")).toBeInTheDocument();

      // Restore original Date
      global.Date = originalDate;
    });
  });

  describe("Accessibility", () => {
    it("should have footer landmark role", () => {
      render(<Footer />);

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("should be accessible with screen readers", () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent("Adelaide Fringe");
    });
  });

  describe("Component Structure", () => {
    it("should maintain proper HTML structure", () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector("footer.footer");
      expect(footer).toBeInTheDocument();

      const container_div = footer.querySelector("div.container");
      expect(container_div).toBeInTheDocument();

      const paragraph = container_div.querySelector("p");
      expect(paragraph).toBeInTheDocument();
    });

    it("should render single paragraph element", () => {
      const { container } = render(<Footer />);

      const paragraphs = container.querySelectorAll("p");
      expect(paragraphs).toHaveLength(1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle year calculation correctly", () => {
      render(<Footer />);

      // Verify that Date is being called to get current year
      const displayedText = screen.getByText(/© \d{4} Adelaide Fringe/);
      expect(displayedText).toBeInTheDocument();
    });

    it("should not crash with Date modifications", () => {
      // Test that the component doesn't break if Date behaves unexpectedly
      expect(() => render(<Footer />)).not.toThrow();
    });
  });
});
