import { describe, it, expect } from "vitest";
import { getAllEvents, getFeaturedEvents, getEventById } from "./eventService";

describe("eventService", () => {
  describe("getAllEvents", () => {
    it("returns all events", async () => {
      const events = await getAllEvents();

      expect(events).toHaveLength(6); // 基于您的模拟数据
      expect(events[0].id).toBe("1");
      expect(events[0].title).toBe("Circus Performance");
    });
  });

  describe("getFeaturedEvents", () => {
    it("returns featured events", async () => {
      const events = await getFeaturedEvents();

      expect(events).toHaveLength(3); // 您的getFeaturedEvents返回前3个
      expect(events[0].id).toBe("1");
    });
  });

  describe("getEventById", () => {
    it("returns event with matching id", async () => {
      const event = await getEventById("2");

      expect(event.id).toBe("2");
      expect(event.title).toBe("Jazz Festival");
    });

    it("rejects when event not found", async () => {
      await expect(getEventById("999")).rejects.toThrow("Event not found");
    });
  });
});
