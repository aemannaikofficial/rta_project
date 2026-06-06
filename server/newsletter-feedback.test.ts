import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

const caller = appRouter.createCaller(createPublicContext());

describe("Newsletter Feedback - Comments", () => {
  it("lists comments for newsletter contentType without error", async () => {
    const result = await caller.comments.list({
      contentType: "newsletter",
      contentId: "apr-2026",
    });
    expect(Array.isArray(result)).toBe(true);
  });

  it("creates a comment for newsletter contentType", async () => {
    const result = await caller.comments.create({
      contentType: "newsletter",
      contentId: "apr-2026",
      text: "Great newsletter edition!",
      userName: "Test User",
    });
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("editToken");
    expect(typeof result.id).toBe("number");
    expect(typeof result.editToken).toBe("string");
  });

  it("updates a newsletter comment with valid editToken", async () => {
    // First create a comment
    const created = await caller.comments.create({
      contentType: "newsletter",
      contentId: "apr-2026",
      text: "Original text",
      userName: "Editor",
    });

    // Then update it
    const updated = await caller.comments.update({
      id: created.id!,
      text: "Updated text",
      editToken: created.editToken!,
    });
    expect(updated.success).toBe(true);
  });

  it("rejects update with invalid editToken", async () => {
    const created = await caller.comments.create({
      contentType: "newsletter",
      contentId: "apr-2026",
      text: "Some text",
      userName: "Someone",
    });

    await expect(
      caller.comments.update({
        id: created.id!,
        text: "Hacked text",
        editToken: "invalid-token",
      })
    ).rejects.toThrow("Unauthorized");
  });
});

describe("Newsletter Feedback - Ratings", () => {
  it("gets ratings for newsletter contentType without error", async () => {
    const result = await caller.ratings.get({
      contentType: "newsletter",
      contentId: "apr-2026",
    });
    expect(result).toHaveProperty("average");
    expect(result).toHaveProperty("count");
    expect(typeof result.average).toBe("number");
    expect(typeof result.count).toBe("number");
  });

  it("submits a rating for newsletter contentType", async () => {
    const result = await caller.ratings.submit({
      contentType: "newsletter",
      contentId: "apr-2026",
      value: 5,
      guestName: "Test Rater",
    });
    expect(result.success).toBe(true);
  });

  it("rejects rating below 1", async () => {
    await expect(
      caller.ratings.submit({
        contentType: "newsletter",
        contentId: "apr-2026",
        value: 0,
        guestName: "Bad Rater",
      })
    ).rejects.toThrow();
  });

  it("rejects rating above 5", async () => {
    await expect(
      caller.ratings.submit({
        contentType: "newsletter",
        contentId: "apr-2026",
        value: 6,
        guestName: "Bad Rater",
      })
    ).rejects.toThrow();
  });
});
