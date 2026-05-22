import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { users, videos, articles, posters, comments, ratings, newsletters } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";
import crypto from "crypto";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  users: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(users).orderBy(users.createdAt);
    }),
    updateRole: adminProcedure
      .input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        if (ctx.user.id === input.userId) throw new Error("Cannot delete your own account");
        await db.delete(users).where(eq(users.id, input.userId));
        return { success: true };
      }),
  }),

  // ─── Videos ───
  videos: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(videos).where(eq(videos.published, true)).orderBy(desc(videos.createdAt));
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [row] = await db.select().from(videos).where(eq(videos.id, input.id));
      return row ?? null;
    }),
    adminList: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(videos).orderBy(desc(videos.createdAt));
    }),
    create: adminProcedure
      .input(z.object({
        titleEn: z.string(), titleAr: z.string(),
        descriptionEn: z.string().optional(), descriptionAr: z.string().optional(),
        videoUrl: z.string(), thumbnailUrl: z.string().optional(),
        duration: z.string().optional(), published: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(videos).values(input);
        return { success: true };
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(), titleEn: z.string().optional(), titleAr: z.string().optional(),
        descriptionEn: z.string().optional(), descriptionAr: z.string().optional(),
        videoUrl: z.string().optional(), thumbnailUrl: z.string().optional(),
        duration: z.string().optional(), published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { id, ...data } = input;
        await db.update(videos).set(data).where(eq(videos.id, id));
        return { success: true };
      }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(videos).where(eq(videos.id, input.id));
      return { success: true };
    }),
  }),

  // ─── Articles ───
  articles: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(articles).where(eq(articles.published, true)).orderBy(desc(articles.createdAt));
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [row] = await db.select().from(articles).where(eq(articles.id, input.id));
      return row ?? null;
    }),
    adminList: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(articles).orderBy(desc(articles.createdAt));
    }),
    create: adminProcedure
      .input(z.object({
        titleEn: z.string(), titleAr: z.string(),
        summaryEn: z.string().optional(), summaryAr: z.string().optional(),
        contentEn: z.string(), contentAr: z.string(),
        coverImageUrl: z.string().optional(), published: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(articles).values(input);
        return { success: true };
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(), titleEn: z.string().optional(), titleAr: z.string().optional(),
        summaryEn: z.string().optional(), summaryAr: z.string().optional(),
        contentEn: z.string().optional(), contentAr: z.string().optional(),
        coverImageUrl: z.string().optional(), published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { id, ...data } = input;
        await db.update(articles).set(data).where(eq(articles.id, id));
        return { success: true };
      }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(articles).where(eq(articles.id, input.id));
      return { success: true };
    }),
  }),

  // ─── Posters ───
  posters: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(posters).where(eq(posters.published, true)).orderBy(desc(posters.createdAt));
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [row] = await db.select().from(posters).where(eq(posters.id, input.id));
      return row ?? null;
    }),
    adminList: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(posters).orderBy(desc(posters.createdAt));
    }),
    create: adminProcedure
      .input(z.object({
        titleEn: z.string(), titleAr: z.string(),
        descriptionEn: z.string().optional(), descriptionAr: z.string().optional(),
        imageUrl: z.string(), thumbnailUrl: z.string().optional(),
        imageUrlAr: z.string().optional(), thumbnailUrlAr: z.string().optional(),
        published: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(posters).values(input);
        return { success: true };
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        titleEn: z.string().optional(), titleAr: z.string().optional(),
        descriptionEn: z.string().optional(), descriptionAr: z.string().optional(),
        imageUrl: z.string().optional(), thumbnailUrl: z.string().optional(),
        imageUrlAr: z.string().optional(), thumbnailUrlAr: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { id, ...data } = input;
        await db.update(posters).set(data).where(eq(posters.id, id));
        return { success: true };
      }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(posters).where(eq(posters.id, input.id));
      return { success: true };
    }),
  }),

  // ─── Newsletters ───
  newsletters: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(newsletters).where(eq(newsletters.published, true)).orderBy(desc(newsletters.createdAt));
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [row] = await db.select().from(newsletters).where(eq(newsletters.id, input.id));
      return row ?? null;
    }),
    adminList: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(newsletters).orderBy(desc(newsletters.createdAt));
    }),
    create: adminProcedure
      .input(z.object({
        titleEn: z.string(), titleAr: z.string(),
        contentEn: z.string(), contentAr: z.string(),
        issueNumber: z.string().optional(), publishDate: z.string().optional(),
        pdfUrl: z.string().optional(), published: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(newsletters).values({
          ...input,
          publishDate: input.publishDate ? new Date(input.publishDate) : new Date()
        });
        return { success: true };
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(), titleEn: z.string().optional(), titleAr: z.string().optional(),
        contentEn: z.string().optional(), contentAr: z.string().optional(),
        issueNumber: z.string().optional(), publishDate: z.string().optional(),
        pdfUrl: z.string().optional(), published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { id, publishDate, ...data } = input;
        const updateData: any = { ...data };
        if (publishDate) updateData.publishDate = new Date(publishDate);
        await db.update(newsletters).set(updateData).where(eq(newsletters.id, id));
        return { success: true };
      }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(newsletters).where(eq(newsletters.id, input.id));
      return { success: true };
    }),
  }),

  // ─── Comments (open, no auth required) ───
  comments: router({
    list: publicProcedure
      .input(z.object({ contentType: z.string(), contentId: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(comments)
          .where(and(eq(comments.contentType, input.contentType), eq(comments.contentId, input.contentId)))
          .orderBy(desc(comments.createdAt));
      }),
    create: publicProcedure
      .input(z.object({
        contentType: z.string(), contentId: z.string(),
        text: z.string().min(1), userName: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const editToken = crypto.randomBytes(32).toString("hex");
        await db.insert(comments).values({ ...input, editToken });
        // Fetch the last inserted comment
        const [row] = await db.select().from(comments)
          .where(and(eq(comments.contentType, input.contentType), eq(comments.contentId, input.contentId), eq(comments.editToken, editToken)))
          .orderBy(desc(comments.id)).limit(1);
        return { id: row?.id, editToken };
      }),
    update: publicProcedure
      .input(z.object({ id: z.number(), text: z.string().min(1), editToken: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const [existing] = await db.select().from(comments).where(eq(comments.id, input.id));
        if (!existing || existing.editToken !== input.editToken) throw new Error("Unauthorized");
        await db.update(comments).set({ text: input.text }).where(eq(comments.id, input.id));
        return { success: true };
      }),
    listAll: adminProcedure
      .query(async () => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(comments).orderBy(desc(comments.createdAt));
      }),
    adminDelete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(comments).where(eq(comments.id, input.id));
        return { success: true };
      }),
  }),

  // ─── Ratings (open, no auth required) ───
  ratings: router({
    get: publicProcedure
      .input(z.object({ contentType: z.string(), contentId: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { average: 0, count: 0 };
        const rows = await db.select().from(ratings)
          .where(and(eq(ratings.contentType, input.contentType), eq(ratings.contentId, input.contentId)));
        if (rows.length === 0) return { average: 0, count: 0 };
        const sum = rows.reduce((a, r) => a + r.value, 0);
        return { average: sum / rows.length, count: rows.length };
      }),
    submit: publicProcedure
      .input(z.object({
        contentType: z.string(), contentId: z.string(),
        value: z.number().min(1).max(5), guestName: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(ratings).values(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
