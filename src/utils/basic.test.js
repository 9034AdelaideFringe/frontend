import { describe, it, expect } from "vitest";

// Simple function for testing
const sum = (a, b) => a + b;

describe("Basic tests", () => {
  it("should run basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should test simple function", () => {
    expect(sum(2, 3)).toBe(5);
  });
});
