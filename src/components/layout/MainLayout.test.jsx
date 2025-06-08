import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MainLayout from "./MainLayout";

// Mock the child components to simplify testing
vi.mock("./Header", () => ({
  default: () => <div data-testid="header">Header Component</div>,
}));

vi.mock("./Footer", () => ({
  default: () => <div data-testid="footer">Footer Component</div>,
}));

// Mock react-router-dom Outlet
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Page Content</div>,
  };
});

describe("MainLayout", () => {
  const renderWithRouter = (component) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  describe("Component Rendering", () => {
    it("should render layout with correct structure", () => {
      renderWithRouter(<MainLayout />);

      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("should have correct CSS classes", () => {
      const { container } = renderWithRouter(<MainLayout />);

      expect(container.querySelector(".layout")).toBeInTheDocument();
      expect(container.querySelector(".main-content")).toBeInTheDocument();
    });

    it("should render header component", () => {
      renderWithRouter(<MainLayout />);

      expect(screen.getByText("Header Component")).toBeInTheDocument();
    });

    it("should render footer component", () => {
      renderWithRouter(<MainLayout />);

      expect(screen.getByText("Footer Component")).toBeInTheDocument();
    });

    it("should render outlet for page content", () => {
      renderWithRouter(<MainLayout />);

      expect(screen.getByText("Page Content")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should maintain proper hierarchical structure", () => {
      const { container } = renderWithRouter(<MainLayout />);

      const layout = container.querySelector(".layout");
      expect(layout).toBeInTheDocument();

      const header = layout.querySelector('[data-testid="header"]');
      const main = layout.querySelector("main.main-content");
      const footer = layout.querySelector('[data-testid="footer"]');

      expect(header).toBeInTheDocument();
      expect(main).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    it("should render main element with correct class", () => {
      const { container } = renderWithRouter(<MainLayout />);

      const main = container.querySelector("main");
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass("main-content");
    });

    it("should have outlet inside main element", () => {
      const { container } = renderWithRouter(<MainLayout />);

      const main = container.querySelector("main.main-content");
      const outlet = main.querySelector('[data-testid="outlet"]');

      expect(outlet).toBeInTheDocument();
    });
  });

  describe("Component Order", () => {
    it("should render components in correct order", () => {
      const { container } = renderWithRouter(<MainLayout />);

      const layout = container.querySelector(".layout");
      const children = Array.from(layout.children);

      expect(children).toHaveLength(3);
      expect(children[0]).toHaveAttribute("data-testid", "header");
      expect(children[1].tagName).toBe("MAIN");
      expect(children[2]).toHaveAttribute("data-testid", "footer");
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure", () => {
      renderWithRouter(<MainLayout />);

      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should maintain landmark structure", () => {
      const { container } = renderWithRouter(<MainLayout />);

      const main = container.querySelector("main");
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass("main-content");
    });
  });

  describe("Integration", () => {
    it("should work with react-router", () => {
      expect(() => renderWithRouter(<MainLayout />)).not.toThrow();
    });

    it("should render without router context errors", () => {
      renderWithRouter(<MainLayout />);

      // Verify all components are rendered without errors
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });
  });

  describe("CSS Classes", () => {
    it("should apply layout class to root div", () => {
      const { container } = renderWithRouter(<MainLayout />);

      const rootDiv = container.firstChild.firstChild; // MemoryRouter > div
      expect(rootDiv).toHaveClass("layout");
    });

    it("should apply main-content class to main element", () => {
      const { container } = renderWithRouter(<MainLayout />);

      const main = container.querySelector("main");
      expect(main).toHaveClass("main-content");
    });
  });

  describe("Component Composition", () => {
    it("should compose Header, main content, and Footer", () => {
      renderWithRouter(<MainLayout />);

      // Check that all three main parts are present
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("should allow content to be rendered in Outlet", () => {
      renderWithRouter(<MainLayout />);

      // The mocked Outlet should render content
      expect(screen.getByText("Page Content")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should render without props", () => {
      expect(() => renderWithRouter(<MainLayout />)).not.toThrow();
    });

    it("should handle missing children gracefully", () => {
      const { container } = renderWithRouter(<MainLayout />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should maintain structure with different router states", () => {
      // Test with different initial route
      const { container } = render(
        <MemoryRouter initialEntries={["/about"]}>
          <MainLayout />
        </MemoryRouter>
      );

      expect(container.querySelector(".layout")).toBeInTheDocument();
      expect(container.querySelector("main.main-content")).toBeInTheDocument();
    });
  });
});
