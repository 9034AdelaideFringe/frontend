import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getUserOrders,
  getOrderById,
  createOrder,
  cancelOrder,
} from "./orderService";

// Mock the dependencies
vi.mock("./ordersMock", () => ({
  mockOrders: [
    {
      id: "order-1",
      date: "2024-01-01T10:00:00Z",
      totalAmount: 50.0,
      status: "COMPLETED",
      items: [
        { id: "item-1", name: "Test Item 1", price: 25.0 },
        { id: "item-2", name: "Test Item 2", price: 25.0 },
      ],
    },
    {
      id: "order-2",
      date: "2024-01-02T10:00:00Z",
      totalAmount: 30.0,
      status: "PENDING",
      items: [{ id: "item-3", name: "Test Item 3", price: 30.0 }],
    },
  ],
}));

vi.mock("./ticketsMock", () => ({
  mockUserTickets: [
    {
      id: "ticket-1",
      orderId: "order-1",
      eventTitle: "Test Event 1",
      ticketType: "General Admission",
      status: "ACTIVE",
    },
    {
      id: "ticket-2",
      orderId: "order-1",
      eventTitle: "Test Event 2",
      ticketType: "VIP",
      status: "ACTIVE",
    },
    {
      id: "ticket-3",
      orderId: "order-2",
      eventTitle: "Test Event 3",
      ticketType: "General",
      status: "PENDING",
    },
  ],
}));

describe("OrderService", () => {
  beforeEach(() => {
    // Reset module state before each test
    vi.resetModules();
  });

  describe("getUserOrders", () => {
    it("should return all user orders", async () => {
      const orders = await getUserOrders();

      expect(orders).toHaveLength(2);
      expect(orders[0]).toEqual({
        id: "order-1",
        date: "2024-01-01T10:00:00Z",
        totalAmount: 50.0,
        status: "COMPLETED",
        items: expect.any(Array),
      });
    });

    it("should return a copy of orders array", async () => {
      const orders1 = await getUserOrders();
      const orders2 = await getUserOrders();

      expect(orders1).not.toBe(orders2); // Different array instances
      expect(orders1).toEqual(orders2); // Same content
    });

    it("should return empty array when no orders exist", async () => {
      // Mock empty orders
      vi.doMock("./ordersMock", () => ({
        mockOrders: [],
      }));

      const { getUserOrders: emptyGetUserOrders } = await import(
        "./orderService"
      );
      const orders = await emptyGetUserOrders();

      expect(orders).toHaveLength(0);
      expect(Array.isArray(orders)).toBe(true);
    });
  });

  describe("getOrderById", () => {
    it("should return order with tickets when order exists", async () => {
      const order = await getOrderById("order-1");

      expect(order).toEqual({
        id: "order-1",
        date: "2024-01-01T10:00:00Z",
        totalAmount: 50.0,
        status: "COMPLETED",
        items: expect.any(Array),
        tickets: expect.any(Array),
      });

      expect(order.tickets).toHaveLength(2);
      expect(order.tickets[0].orderId).toBe("order-1");
    });

    it("should return order with single ticket", async () => {
      const order = await getOrderById("order-2");

      expect(order.tickets).toHaveLength(1);
      expect(order.tickets[0].orderId).toBe("order-2");
    });

    it("should reject with error when order not found", async () => {
      await expect(getOrderById("non-existent")).rejects.toThrow(
        "Order not found"
      );
    });

    it("should handle order with no tickets", async () => {
      // Mock order with no associated tickets
      vi.doMock("./ordersMock", () => ({
        mockOrders: [
          {
            id: "order-no-tickets",
            date: "2024-01-03T10:00:00Z",
            totalAmount: 20.0,
            status: "COMPLETED",
            items: [],
          },
        ],
      }));

      vi.doMock("./ticketsMock", () => ({
        mockUserTickets: [],
      }));

      const { getOrderById: testGetOrderById } = await import("./orderService");
      const order = await testGetOrderById("order-no-tickets");

      expect(order.tickets).toHaveLength(0);
    });

    it("should handle null or undefined orderId", async () => {
      await expect(getOrderById(null)).rejects.toThrow("Order not found");
      await expect(getOrderById(undefined)).rejects.toThrow("Order not found");
    });
  });

  describe("createOrder", () => {
    beforeEach(() => {
      // Mock Date.now for consistent testing
      vi.spyOn(Date, "now").mockReturnValue(1234567890000);
      vi.spyOn(Date.prototype, "toISOString").mockReturnValue(
        "2024-01-15T10:00:00.000Z"
      );
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should create new order with generated ID", async () => {
      const orderData = {
        totalAmount: 75.0,
        items: [{ id: "new-item-1", name: "New Item", price: 75.0 }],
      };

      const newOrder = await createOrder(orderData);

      expect(newOrder).toEqual({
        id: "order-1234567890000",
        date: "2024-01-15T10:00:00.000Z",
        totalAmount: 75.0,
        status: "COMPLETED",
        items: orderData.items,
      });
    });

    it("should add new order to the beginning of orders list", async () => {
      const orderData = {
        totalAmount: 100.0,
        items: [{ id: "test-item", name: "Test", price: 100.0 }],
      };

      await createOrder(orderData);
      const orders = await getUserOrders();

      expect(orders[0].id).toBe("order-1234567890000");
      expect(orders[0].totalAmount).toBe(100.0);
    });

    it("should handle empty items array", async () => {
      const orderData = {
        totalAmount: 0,
        items: [],
      };

      const newOrder = await createOrder(orderData);

      expect(newOrder.items).toEqual([]);
      expect(newOrder.totalAmount).toBe(0);
    });

    it("should handle missing orderData properties", async () => {
      const orderData = {};

      const newOrder = await createOrder(orderData);

      expect(newOrder.totalAmount).toBeUndefined();
      expect(newOrder.items).toBeUndefined();
      expect(newOrder.status).toBe("COMPLETED");
    });
  });

  describe("cancelOrder", () => {
    it("should cancel existing order", async () => {
      const result = await cancelOrder("order-1");

      expect(result).toEqual({
        success: true,
        message: "Order cancelled successfully",
      });

      // Verify order status was updated
      const orders = await getUserOrders();
      const cancelledOrder = orders.find((order) => order.id === "order-1");
      expect(cancelledOrder.status).toBe("CANCELLED");
    });

    it("should reject when order not found", async () => {
      await expect(cancelOrder("non-existent")).rejects.toThrow(
        "Order not found"
      );
    });

    it("should handle null or undefined orderId", async () => {
      await expect(cancelOrder(null)).rejects.toThrow("Order not found");
      await expect(cancelOrder(undefined)).rejects.toThrow("Order not found");
    });

    it("should not modify other orders when cancelling one", async () => {
      const ordersBefore = await getUserOrders();
      const otherOrderBefore = ordersBefore.find(
        (order) => order.id === "order-2"
      );

      await cancelOrder("order-1");

      const ordersAfter = await getUserOrders();
      const otherOrderAfter = ordersAfter.find(
        (order) => order.id === "order-2"
      );

      expect(otherOrderAfter.status).toBe(otherOrderBefore.status);
    });

    it("should cancel already cancelled order", async () => {
      // Cancel first time
      await cancelOrder("order-1");

      // Cancel again
      const result = await cancelOrder("order-1");

      expect(result.success).toBe(true);

      const orders = await getUserOrders();
      const cancelledOrder = orders.find((order) => order.id === "order-1");
      expect(cancelledOrder.status).toBe("CANCELLED");
    });
  });

  describe("Integration tests", () => {
    it("should maintain order consistency across operations", async () => {
      // Create new order
      const newOrderData = {
        totalAmount: 200.0,
        items: [
          { id: "integration-item", name: "Integration Test", price: 200.0 },
        ],
      };

      const newOrder = await createOrder(newOrderData);

      // Get the order by ID
      const retrievedOrder = await getOrderById(newOrder.id);
      expect(retrievedOrder.totalAmount).toBe(200.0);

      // Cancel the order
      await cancelOrder(newOrder.id);

      // Verify cancellation
      const cancelledOrder = await getOrderById(newOrder.id);
      expect(cancelledOrder.status).toBe("CANCELLED");
    });

    it("should handle multiple operations in sequence", async () => {
      const initialOrders = await getUserOrders();
      const initialCount = initialOrders.length;

      // Create multiple orders
      await createOrder({ totalAmount: 50, items: [] });
      await createOrder({ totalAmount: 75, items: [] });

      const afterCreate = await getUserOrders();
      expect(afterCreate).toHaveLength(initialCount + 2);

      // Cancel first order
      await cancelOrder(afterCreate[0].id);

      const afterCancel = await getUserOrders();
      expect(afterCancel[0].status).toBe("CANCELLED");
      expect(afterCancel[1].status).toBe("COMPLETED");
    });
  });
});
