import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { TRPCError } from "@trpc/server";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@rta.ae",
    name: "Admin User",
    loginMethod: "local",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createRegularUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@rta.ae",
    name: "Regular User",
    loginMethod: "local",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createUnauthenticatedContext(): TrpcContext {
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

describe("admin procedures", () => {
  describe("users.list", () => {
    it("allows admin users to list users", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Should not throw — admin has access
      // The actual DB may not be available in test, but the procedure should not throw FORBIDDEN
      try {
        await caller.users.list();
      } catch (error) {
        // If it throws, it should NOT be a FORBIDDEN error
        if (error instanceof TRPCError) {
          expect(error.code).not.toBe("FORBIDDEN");
        }
      }
    });

    it("rejects non-admin users from listing users", async () => {
      const ctx = createRegularUserContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.users.list()).rejects.toThrow(TRPCError);
      try {
        await caller.users.list();
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("FORBIDDEN");
      }
    });

    it("rejects unauthenticated users from listing users", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.users.list()).rejects.toThrow(TRPCError);
      try {
        await caller.users.list();
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("FORBIDDEN");
      }
    });
  });

  describe("users.updateRole", () => {
    it("rejects non-admin users from updating roles", async () => {
      const ctx = createRegularUserContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.users.updateRole({ userId: 1, role: "admin" })
      ).rejects.toThrow(TRPCError);

      try {
        await caller.users.updateRole({ userId: 1, role: "admin" });
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("FORBIDDEN");
      }
    });

    it("rejects unauthenticated users from updating roles", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.users.updateRole({ userId: 1, role: "admin" })
      ).rejects.toThrow(TRPCError);
    });
  });

  describe("users.delete", () => {
    it("rejects non-admin users from deleting users", async () => {
      const ctx = createRegularUserContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.users.delete({ userId: 1 })
      ).rejects.toThrow(TRPCError);

      try {
        await caller.users.delete({ userId: 1 });
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("FORBIDDEN");
      }
    });

    it("rejects unauthenticated users from deleting users", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.users.delete({ userId: 1 })
      ).rejects.toThrow(TRPCError);
    });
  });

  describe("auth.me", () => {
    it("returns user data for authenticated users", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();
      expect(result).toBeDefined();
      expect(result?.name).toBe("Admin User");
      expect(result?.email).toBe("admin@rta.ae");
      expect(result?.role).toBe("admin");
    });

    it("returns null for unauthenticated users", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();
      expect(result).toBeNull();
    });
  });
});
