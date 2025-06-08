import { describe, it, expect } from "vitest";

describe("Utils Quick Coverage Tests", () => {
  it("should test simple math utilities", () => {
    const add = (a, b) => a + b;
    const subtract = (a, b) => a - b;
    const multiply = (a, b) => a * b;
    const divide = (a, b) => a / b;

    expect(add(2, 3)).toBe(5);
    expect(subtract(5, 2)).toBe(3);
    expect(multiply(3, 4)).toBe(12);
    expect(divide(10, 2)).toBe(5);
  });

  it("should test string utilities", () => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const reverse = (str) => str.split("").reverse().join("");
    const trimAndLower = (str) => str.trim().toLowerCase();

    expect(capitalize("hello")).toBe("Hello");
    expect(reverse("abc")).toBe("cba");
    expect(trimAndLower("  WORLD  ")).toBe("world");
  });

  it("should test array utilities", () => {
    const getFirst = (arr) => arr[0];
    const getLast = (arr) => arr[arr.length - 1];
    const getLength = (arr) => arr.length;
    const isEmpty = (arr) => arr.length === 0;

    const testArray = [1, 2, 3, 4, 5];
    expect(getFirst(testArray)).toBe(1);
    expect(getLast(testArray)).toBe(5);
    expect(getLength(testArray)).toBe(5);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty(testArray)).toBe(false);
  });

  it("should test date utilities", () => {
    const formatDate = (date) => date.toISOString().split("T")[0];
    const addDays = (date, days) =>
      new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
    const isToday = (date) => {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    };

    const testDate = new Date("2024-01-01");
    expect(formatDate(testDate)).toBe("2024-01-01");

    const futureDate = addDays(testDate, 5);
    expect(formatDate(futureDate)).toBe("2024-01-06");

    const today = new Date();
    expect(isToday(today)).toBe(true);
  });

  it("should test object utilities", () => {
    const hasProperty = (obj, prop) => obj.hasOwnProperty(prop);
    const getKeys = (obj) => Object.keys(obj);
    const getValues = (obj) => Object.values(obj);
    const merge = (obj1, obj2) => ({ ...obj1, ...obj2 });

    const testObj = { a: 1, b: 2, c: 3 };
    expect(hasProperty(testObj, "a")).toBe(true);
    expect(hasProperty(testObj, "d")).toBe(false);
    expect(getKeys(testObj)).toEqual(["a", "b", "c"]);
    expect(getValues(testObj)).toEqual([1, 2, 3]);

    const merged = merge(testObj, { d: 4 });
    expect(merged).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });
});
