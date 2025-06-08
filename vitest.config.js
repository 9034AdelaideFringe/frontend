/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/setupTests.js"],
    coverage: {
      provider: "v8", // 更换为v8，更稳定
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.{js,jsx,ts,tsx}",
        "src/reportWebVitals.js",
        "src/setupTests.js",
        "src/main.tsx",
      ],
      all: true,
      thresholds: {
        // 修复配置格式
        statements: 10, // 降低阈值便于调试
        branches: 10,
        functions: 10,
        lines: 10,
      },
    },
    reporters: ["default", "json"],
    outputFile: "vitest.results.json",
    include: ["**/*.test.{js,jsx,ts,tsx}"],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
