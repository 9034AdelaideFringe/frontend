import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, logout, isAuthenticated, getCurrentUser } from "./authService";

// 模拟全局 fetch
global.fetch = vi.fn();

// 模拟 localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("authService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("login", () => {
    it("handles successful login", async () => {
      const userData = { id: 1, email: "test@example.com", role: "user" };

      // 模拟成功响应
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(userData),
      });

      const result = await login({
        email: "test@example.com",
        password: "password",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/login",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            password: "password",
          }),
        })
      );

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(userData)
      );
      expect(localStorage.setItem).toHaveBeenCalledWith("isLoggedIn", "true");
      expect(result).toEqual(userData);
    });

    it("handles login failure", async () => {
      // 模拟失败响应
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: "Invalid credentials" }),
      });

      await expect(
        login({ email: "test@example.com", password: "wrong" })
      ).rejects.toEqual({ message: "Invalid credentials" });
    });
  });

  describe("logout", () => {
    it("removes user data and calls API", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await logout();

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/logout",
        expect.anything()
      );
      expect(localStorage.removeItem).toHaveBeenCalledWith("isLoggedIn");
      expect(localStorage.removeItem).toHaveBeenCalledWith("user");
    });
  });

  describe("getCurrentUser", () => {
    it("returns user from localStorage", () => {
      const mockUser = { id: 1, name: "Test User" };
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUser));

      const result = getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    it("returns null when no user in localStorage", () => {
      localStorage.getItem.mockReturnValueOnce(null);

      const result = getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("returns true when user is logged in", () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === "isLoggedIn") return "true";
        if (key === "user") return JSON.stringify({ id: 1 });
        return null;
      });

      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    it("returns false when user is not logged in", () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === "isLoggedIn") return null;
        return null;
      });

      const result = isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
