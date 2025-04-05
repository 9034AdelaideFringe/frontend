import { describe, it, expect } from "vitest";

// 一个简单的函数用于测试
const sum = (a, b) => a + b;

describe("基本测试", () => {
  it("可以运行最基本的测试", () => {
    expect(1 + 1).toBe(2);
  });

  it("可以测试一个简单函数", () => {
    expect(sum(2, 3)).toBe(5);
  });
});
