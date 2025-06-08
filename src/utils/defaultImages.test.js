import { describe, it, expect, vi } from "vitest";
import { getRandomDefaultImageUrl } from "./defaultImages";

describe("defaultImages", () => {
  describe("getRandomDefaultImageUrl", () => {
    it("should return a string", () => {
      const result = getRandomDefaultImageUrl();
      expect(typeof result).toBe("string");
    });

    it("should return a valid URL", () => {
      const result = getRandomDefaultImageUrl();
      expect(result).toMatch(/^https:\/\//);
      expect(() => new URL(result)).not.toThrow();
    });

    it("should return a URL from the predefined list", () => {
      const result = getRandomDefaultImageUrl();
      const expectedDomains = ["images.unsplash.com", "plus.unsplash.com"];
      const url = new URL(result);
      expect(expectedDomains).toContain(url.hostname);
    });

    it("should return different URLs on multiple calls", () => {
      const results = new Set();
      // Call multiple times to increase chance of getting different URLs
      for (let i = 0; i < 50; i++) {
        results.add(getRandomDefaultImageUrl());
      }
      // Should have at least 2 different URLs (statistically very likely)
      expect(results.size).toBeGreaterThan(1);
    });

    it("should always return a non-empty string", () => {
      for (let i = 0; i < 10; i++) {
        const result = getRandomDefaultImageUrl();
        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
      }
    });

    it("should return predictable result with mocked Math.random", () => {
      // Mock Math.random to return 0 (first item)
      const mockRandom = vi.spyOn(Math, "random").mockReturnValue(0);

      const result = getRandomDefaultImageUrl();
      expect(result).toContain("unsplash.com");

      mockRandom.mockRestore();
    });

    it("should handle boundary case with Math.random returning close to 1", () => {
      // Mock Math.random to return value close to 1 (last item)
      const mockRandom = vi.spyOn(Math, "random").mockReturnValue(0.999);

      const result = getRandomDefaultImageUrl();
      expect(result).toContain("unsplash.com");
      expect(typeof result).toBe("string");

      mockRandom.mockRestore();
    });
  });
});
