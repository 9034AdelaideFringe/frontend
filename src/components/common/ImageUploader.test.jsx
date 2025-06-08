import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageUploader from "./ImageUploader";

// Mock the CSS module
vi.mock("./ImageUploader.module.css", () => ({
  default: {
    imageUploader: "mock-image-uploader",
    inputGroup: "mock-input-group",
    urlInput: "mock-url-input",
    browseButton: "mock-browse-button",
    error: "mock-error",
    previewContainer: "mock-preview-container",
    preview: "mock-preview",
    removeButton: "mock-remove-button",
  },
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => "mock-object-url");
global.URL.revokeObjectURL = vi.fn();

describe("ImageUploader", () => {
  const defaultProps = {
    onImageUploaded: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render with default props", () => {
      render(<ImageUploader {...defaultProps} />);

      expect(
        screen.getByPlaceholderText("Enter image URL or select a file")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Browse" })
      ).toBeInTheDocument();
    });

    it("should render with custom props", () => {
      const props = {
        ...defaultProps,
        label: "Upload Image",
        placeholder: "Custom placeholder",
        id: "custom-upload",
        currentImageUrl: "https://example.com/image.jpg",
      };

      render(<ImageUploader {...props} />);

      expect(
        screen.getByPlaceholderText("Custom placeholder")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Upload Image" })
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("https://example.com/image.jpg")
      ).toBeInTheDocument();
    });

    it("should have correct CSS classes", () => {
      const { container } = render(<ImageUploader {...defaultProps} />);

      expect(container.firstChild).toHaveClass("mock-image-uploader");
      expect(container.querySelector(".mock-input-group")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveClass("mock-url-input");
      expect(screen.getByRole("button", { name: "Browse" })).toHaveClass(
        "mock-browse-button"
      );
    });

    it("should show preview when currentImageUrl is provided", () => {
      render(
        <ImageUploader
          {...defaultProps}
          currentImageUrl="https://example.com/image.jpg"
        />
      );

      expect(screen.getByAltText("Preview")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Remove" })
      ).toBeInTheDocument();
    });
  });

  describe("URL Input Handling", () => {
    it("should update input value when user types", async () => {
      const user = userEvent.setup();

      render(<ImageUploader {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "https://example.com/image.jpg");

      expect(input.value).toBe("https://example.com/image.jpg");
    });

    it("should validate and accept valid image URL on blur", async () => {
      const user = userEvent.setup();
      const onImageUploadedMock = vi.fn();

      render(
        <ImageUploader
          {...defaultProps}
          onImageUploaded={onImageUploadedMock}
        />
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "https://example.com/image.jpg");
      await user.tab(); // Trigger blur

      expect(onImageUploadedMock).toHaveBeenCalledWith(
        "https://example.com/image.jpg"
      );
      expect(screen.getByAltText("Preview")).toBeInTheDocument();
    });

    it("should show error for invalid URL", async () => {
      const user = userEvent.setup();

      render(<ImageUploader {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "invalid-url");
      await user.tab(); // Trigger blur

      expect(
        screen.getByText("Please enter a valid image URL")
      ).toBeInTheDocument();
    });

    it("should clear preview when input is emptied", async () => {
      const user = userEvent.setup();
      const onImageUploadedMock = vi.fn();

      render(
        <ImageUploader
          {...defaultProps}
          onImageUploaded={onImageUploadedMock}
          currentImageUrl="https://example.com/image.jpg"
        />
      );

      const input = screen.getByRole("textbox");
      await user.clear(input);

      expect(onImageUploadedMock).toHaveBeenCalledWith("");
    });

    it("should clear error when user starts typing after error", async () => {
      const user = userEvent.setup();

      render(<ImageUploader {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "invalid-url");
      await user.tab();

      expect(
        screen.getByText("Please enter a valid image URL")
      ).toBeInTheDocument();

      await user.type(input, "a");

      expect(
        screen.queryByText("Please enter a valid image URL")
      ).not.toBeInTheDocument();
    });
  });

  describe("File Upload Handling", () => {
    it("should trigger file input when browse button is clicked", () => {
      render(<ImageUploader {...defaultProps} />);

      const fileInput = screen
        .getByRole("button", { name: "Browse" })
        .parentElement.querySelector('input[type="file"]');
      const clickSpy = vi.spyOn(fileInput, "click");

      fireEvent.click(screen.getByRole("button", { name: "Browse" }));

      expect(clickSpy).toHaveBeenCalled();
    });

    it("should handle valid file upload", async () => {
      const onImageUploadedMock = vi.fn();

      render(
        <ImageUploader
          {...defaultProps}
          onImageUploaded={onImageUploadedMock}
        />
      );

      const file = new File(["image"], "test.jpg", { type: "image/jpeg" });
      const fileInput = screen
        .getByRole("button", { name: "Browse" })
        .parentElement.querySelector('input[type="file"]');

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(onImageUploadedMock).toHaveBeenCalledWith(file);
      });

      expect(screen.getByAltText("Preview")).toBeInTheDocument();
    });

    it("should reject invalid file types", async () => {
      render(<ImageUploader {...defaultProps} />);

      const file = new File(["content"], "test.txt", { type: "text/plain" });
      const fileInput = screen
        .getByRole("button", { name: "Browse" })
        .parentElement.querySelector('input[type="file"]');

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(
          screen.getByText(
            "Please select a valid image file (JPEG, PNG, GIF, WEBP)"
          )
        ).toBeInTheDocument();
      });
    });

    it("should reject files larger than 5MB", async () => {
      render(<ImageUploader {...defaultProps} />);

      const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
        type: "image/jpeg",
      });
      const fileInput = screen
        .getByRole("button", { name: "Browse" })
        .parentElement.querySelector('input[type="file"]');

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(
          screen.getByText("Image size should not exceed 5MB")
        ).toBeInTheDocument();
      });
    });

    it("should show uploading state", async () => {
      render(<ImageUploader {...defaultProps} />);

      const file = new File(["image"], "test.jpg", { type: "image/jpeg" });
      const fileInput = screen
        .getByRole("button", { name: "Browse" })
        .parentElement.querySelector('input[type="file"]');

      fireEvent.change(fileInput, { target: { files: [file] } });

      // Should show uploading state temporarily
      expect(
        screen.getByRole("button", { name: "Uploading..." })
      ).toBeInTheDocument();
    });
  });

  describe("Image Preview", () => {
    it("should show preview with remove button when image is loaded", () => {
      render(
        <ImageUploader
          {...defaultProps}
          currentImageUrl="https://example.com/image.jpg"
        />
      );

      expect(screen.getByAltText("Preview")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Remove" })
      ).toBeInTheDocument();
    });

    it("should remove image when remove button is clicked", async () => {
      const user = userEvent.setup();
      const onImageUploadedMock = vi.fn();

      render(
        <ImageUploader
          {...defaultProps}
          onImageUploaded={onImageUploadedMock}
          currentImageUrl="https://example.com/image.jpg"
        />
      );

      await user.click(screen.getByRole("button", { name: "Remove" }));

      expect(onImageUploadedMock).toHaveBeenCalledWith("");
      expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
    });

    it("should have proper CSS classes for preview", () => {
      const { container } = render(
        <ImageUploader
          {...defaultProps}
          currentImageUrl="https://example.com/image.jpg"
        />
      );

      expect(
        container.querySelector(".mock-preview-container")
      ).toBeInTheDocument();
      expect(screen.getByAltText("Preview")).toHaveClass("mock-preview");
      expect(screen.getByRole("button", { name: "Remove" })).toHaveClass(
        "mock-remove-button"
      );
    });
  });

  describe("URL Validation", () => {
    const testCases = [
      { url: "https://example.com/image.jpg", valid: true },
      { url: "http://example.com/image.png", valid: true },
      { url: "https://example.com/image.gif", valid: true },
      { url: "https://example.com/image.webp", valid: true },
      {
        url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
        valid: true,
      },
      { url: "invalid-url", valid: false },
      { url: "https://example.com/document.pdf", valid: false },
      { url: "", valid: false },
    ];

    testCases.forEach(({ url, valid }) => {
      it(`should ${valid ? "accept" : "reject"} URL: ${url}`, async () => {
        const user = userEvent.setup();
        const onImageUploadedMock = vi.fn();

        render(
          <ImageUploader
            {...defaultProps}
            onImageUploaded={onImageUploadedMock}
          />
        );

        const input = screen.getByRole("textbox");
        if (url) {
          await user.type(input, url);
          await user.tab();
        }

        if (valid && url) {
          expect(onImageUploadedMock).toHaveBeenCalledWith(url);
          expect(
            screen.queryByText("Please enter a valid image URL")
          ).not.toBeInTheDocument();
        } else if (!valid && url) {
          expect(
            screen.getByText("Please enter a valid image URL")
          ).toBeInTheDocument();
        }
      });
    });
  });

  describe("Component State Management", () => {
    it("should update when currentImageUrl prop changes", () => {
      const { rerender } = render(
        <ImageUploader {...defaultProps} currentImageUrl="" />
      );

      expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();

      rerender(
        <ImageUploader
          {...defaultProps}
          currentImageUrl="https://example.com/image.jpg"
        />
      );

      expect(screen.getByAltText("Preview")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("https://example.com/image.jpg")
      ).toBeInTheDocument();
    });

    it("should maintain state during re-renders", () => {
      const { rerender } = render(<ImageUploader {...defaultProps} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "test input" } });

      rerender(<ImageUploader {...defaultProps} />);

      expect(screen.getByDisplayValue("test input")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper input attributes", () => {
      render(<ImageUploader {...defaultProps} id="custom-upload" />);

      const textInput = screen.getByRole("textbox");
      expect(textInput).toHaveAttribute("type", "text");
      expect(textInput).toHaveAttribute("placeholder");

      const fileInput = screen
        .getByRole("button", { name: "Browse" })
        .parentElement.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute("accept", "image/*");
      expect(fileInput).toHaveAttribute("id", "custom-upload");
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();

      render(<ImageUploader {...defaultProps} />);

      // Tab to text input
      await user.tab();
      expect(screen.getByRole("textbox")).toHaveFocus();

      // Tab to browse button
      await user.tab();
      expect(screen.getByRole("button", { name: "Browse" })).toHaveFocus();
    });

    it("should disable controls during upload", () => {
      render(<ImageUploader {...defaultProps} />);

      const file = new File(["image"], "test.jpg", { type: "image/jpeg" });
      const fileInput = screen
        .getByRole("button", { name: "Browse" })
        .parentElement.querySelector('input[type="file"]');

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(screen.getByRole("textbox")).toBeDisabled();
      expect(
        screen.getByRole("button", { name: "Uploading..." })
      ).toBeDisabled();
    });
  });

  describe("Error Handling", () => {
    it("should display error with proper styling", async () => {
      const user = userEvent.setup();

      render(<ImageUploader {...defaultProps} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "invalid-url");
      await user.tab();

      const errorElement = screen.getByText("Please enter a valid image URL");
      expect(errorElement).toHaveClass("mock-error");
    });

    it("should clear error when image is removed", async () => {
      const user = userEvent.setup();

      render(
        <ImageUploader
          {...defaultProps}
          currentImageUrl="https://example.com/image.jpg"
        />
      );

      // First add an error by typing invalid URL
      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "invalid");
      await user.tab();

      expect(
        screen.getByText("Please enter a valid image URL")
      ).toBeInTheDocument();

      // Remove image should clear error
      await user.click(screen.getByRole("button", { name: "Remove" }));

      expect(
        screen.queryByText("Please enter a valid image URL")
      ).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing onImageUploaded callback", () => {
      const props = {
        currentImageUrl: "https://example.com/image.jpg",
      };

      expect(() => render(<ImageUploader {...props} />)).not.toThrow();
    });

    it("should handle file input with no files selected", () => {
      render(<ImageUploader {...defaultProps} />);

      const fileInput = screen
        .getByRole("button", { name: "Browse" })
        .parentElement.querySelector('input[type="file"]');

      fireEvent.change(fileInput, { target: { files: [] } });

      // Should not throw error or change state
      expect(
        screen.queryByText("Please select a valid image file")
      ).not.toBeInTheDocument();
    });

    it("should handle URL blur with empty input", async () => {
      const user = userEvent.setup();
      const onImageUploadedMock = vi.fn();

      render(
        <ImageUploader
          {...defaultProps}
          onImageUploaded={onImageUploadedMock}
        />
      );

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.tab();

      // Should not call onImageUploaded or show error
      expect(onImageUploadedMock).not.toHaveBeenCalled();
      expect(
        screen.queryByText("Please enter a valid image URL")
      ).not.toBeInTheDocument();
    });
  });
});
