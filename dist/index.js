var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users, videos, articles, posters, comments, ratings, newsletters;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      id: int("id").autoincrement().primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    videos = mysqlTable("videos", {
      id: int("id").autoincrement().primaryKey(),
      titleEn: varchar("titleEn", { length: 500 }).notNull(),
      titleAr: varchar("titleAr", { length: 500 }).notNull(),
      descriptionEn: text("descriptionEn"),
      descriptionAr: text("descriptionAr"),
      videoUrl: text("videoUrl").notNull(),
      thumbnailUrl: text("thumbnailUrl"),
      duration: varchar("duration", { length: 20 }),
      published: boolean("published").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    articles = mysqlTable("articles", {
      id: int("id").autoincrement().primaryKey(),
      titleEn: varchar("titleEn", { length: 500 }).notNull(),
      titleAr: varchar("titleAr", { length: 500 }).notNull(),
      summaryEn: text("summaryEn"),
      summaryAr: text("summaryAr"),
      contentEn: text("contentEn").notNull(),
      contentAr: text("contentAr").notNull(),
      coverImageUrl: text("coverImageUrl"),
      published: boolean("published").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    posters = mysqlTable("posters", {
      id: int("id").autoincrement().primaryKey(),
      titleEn: varchar("titleEn", { length: 500 }).notNull(),
      titleAr: varchar("titleAr", { length: 500 }).notNull(),
      descriptionEn: text("descriptionEn"),
      descriptionAr: text("descriptionAr"),
      imageUrl: text("imageUrl").notNull(),
      thumbnailUrl: text("thumbnailUrl"),
      imageUrlAr: text("imageUrlAr"),
      thumbnailUrlAr: text("thumbnailUrlAr"),
      published: boolean("published").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    comments = mysqlTable("comments", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId"),
      userName: varchar("userName", { length: 255 }),
      contentType: varchar("contentType", { length: 20 }).notNull(),
      contentId: varchar("contentId", { length: 100 }).notNull(),
      text: text("text").notNull(),
      editToken: varchar("editToken", { length: 64 }),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    ratings = mysqlTable("ratings", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId"),
      guestName: varchar("guestName", { length: 255 }),
      contentType: varchar("contentType", { length: 20 }).notNull(),
      contentId: varchar("contentId", { length: 100 }).notNull(),
      value: int("value").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    newsletters = mysqlTable("newsletters", {
      id: int("id").autoincrement().primaryKey(),
      titleEn: varchar("titleEn", { length: 500 }).notNull(),
      titleAr: varchar("titleAr", { length: 500 }).notNull(),
      contentEn: text("contentEn").notNull(),
      contentAr: text("contentAr").notNull(),
      issueNumber: varchar("issueNumber", { length: 50 }),
      publishDate: timestamp("publishDate"),
      pdfUrl: text("pdfUrl"),
      imageUrl: text("imageUrl"),
      published: boolean("published").default(false).notNull(),
      editionNumber: int("editionNumber").notNull().default(1),
      sectionNumber: int("sectionNumber").notNull().default(1),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
      publicSiteUrl: process.env.PUBLIC_SITE_URL ?? "http://localhost:3000"
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  getDb: () => getDb,
  getUserByOpenId: () => getUserByOpenId,
  upsertUser: () => upsertUser
});
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId || "local",
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
init_db();
init_schema();
import { eq as eq2, and, desc, sql } from "drizzle-orm";
import { z as z2 } from "zod";
import crypto from "crypto";
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  users: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(users).orderBy(users.createdAt);
    }),
    updateRole: adminProcedure.input(z2.object({ userId: z2.number(), role: z2.enum(["user", "admin"]) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(users).set({ role: input.role }).where(eq2(users.id, input.userId));
      return { success: true };
    }),
    delete: adminProcedure.input(z2.object({ userId: z2.number() })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      if (ctx.user.id === input.userId) throw new Error("Cannot delete your own account");
      await db.delete(users).where(eq2(users.id, input.userId));
      return { success: true };
    })
  }),
  // ─── Videos ───
  videos: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(videos).where(eq2(videos.published, true)).orderBy(desc(videos.createdAt));
    }),
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [row] = await db.select().from(videos).where(eq2(videos.id, input.id));
      return row ?? null;
    }),
    adminList: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(videos).orderBy(desc(videos.createdAt));
    }),
    create: adminProcedure.input(z2.object({
      titleEn: z2.string(),
      titleAr: z2.string(),
      descriptionEn: z2.string().optional(),
      descriptionAr: z2.string().optional(),
      videoUrl: z2.string(),
      thumbnailUrl: z2.string().optional(),
      duration: z2.string().optional(),
      published: z2.boolean().default(false)
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(videos).values(input);
      return { success: true };
    }),
    update: adminProcedure.input(z2.object({
      id: z2.number(),
      titleEn: z2.string().optional(),
      titleAr: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionAr: z2.string().optional(),
      videoUrl: z2.string().optional(),
      thumbnailUrl: z2.string().optional(),
      duration: z2.string().optional(),
      published: z2.boolean().optional()
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db.update(videos).set(data).where(eq2(videos.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(videos).where(eq2(videos.id, input.id));
      return { success: true };
    })
  }),
  // ─── Articles ───
  articles: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(articles).where(eq2(articles.published, true)).orderBy(desc(articles.createdAt));
    }),
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [row] = await db.select().from(articles).where(eq2(articles.id, input.id));
      return row ?? null;
    }),
    adminList: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(articles).orderBy(desc(articles.createdAt));
    }),
    create: adminProcedure.input(z2.object({
      titleEn: z2.string(),
      titleAr: z2.string(),
      summaryEn: z2.string().optional(),
      summaryAr: z2.string().optional(),
      contentEn: z2.string(),
      contentAr: z2.string(),
      coverImageUrl: z2.string().optional(),
      published: z2.boolean().default(false)
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(articles).values(input);
      return { success: true };
    }),
    update: adminProcedure.input(z2.object({
      id: z2.number(),
      titleEn: z2.string().optional(),
      titleAr: z2.string().optional(),
      summaryEn: z2.string().optional(),
      summaryAr: z2.string().optional(),
      contentEn: z2.string().optional(),
      contentAr: z2.string().optional(),
      coverImageUrl: z2.string().optional(),
      published: z2.boolean().optional()
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db.update(articles).set(data).where(eq2(articles.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(articles).where(eq2(articles.id, input.id));
      return { success: true };
    })
  }),
  // ─── Posters ───
  posters: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(posters).where(eq2(posters.published, true)).orderBy(desc(posters.createdAt));
    }),
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [row] = await db.select().from(posters).where(eq2(posters.id, input.id));
      return row ?? null;
    }),
    adminList: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(posters).orderBy(desc(posters.createdAt));
    }),
    create: adminProcedure.input(z2.object({
      titleEn: z2.string(),
      titleAr: z2.string(),
      descriptionEn: z2.string().optional(),
      descriptionAr: z2.string().optional(),
      imageUrl: z2.string(),
      thumbnailUrl: z2.string().optional(),
      imageUrlAr: z2.string().optional(),
      thumbnailUrlAr: z2.string().optional(),
      published: z2.boolean().default(false)
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(posters).values(input);
      return { success: true };
    }),
    update: adminProcedure.input(z2.object({
      id: z2.number(),
      titleEn: z2.string().optional(),
      titleAr: z2.string().optional(),
      descriptionEn: z2.string().optional(),
      descriptionAr: z2.string().optional(),
      imageUrl: z2.string().optional(),
      thumbnailUrl: z2.string().optional(),
      imageUrlAr: z2.string().optional(),
      thumbnailUrlAr: z2.string().optional(),
      published: z2.boolean().optional()
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db.update(posters).set(data).where(eq2(posters.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(posters).where(eq2(posters.id, input.id));
      return { success: true };
    })
  }),
  // ─── Newsletters ───
  newsletters: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(newsletters).where(eq2(newsletters.published, true)).orderBy(desc(newsletters.createdAt));
    }),
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [row] = await db.select().from(newsletters).where(eq2(newsletters.id, input.id));
      return row ?? null;
    }),
    adminList: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(newsletters).orderBy(desc(newsletters.createdAt));
    }),
    // ─── Returns newsletters grouped by edition number ───
    editionsList: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const all = await db.select().from(newsletters).where(eq2(newsletters.published, true)).orderBy(newsletters.editionNumber, newsletters.sectionNumber);
      const map = /* @__PURE__ */ new Map();
      for (const n of all) {
        const ed = n.editionNumber ?? 1;
        if (!map.has(ed)) map.set(ed, []);
        map.get(ed).push(n);
      }
      return Array.from(map.entries()).sort(([a], [b]) => a - b).map(([editionNumber, items]) => ({
        editionNumber,
        newsletters: items
      }));
    }),
    // ─── For admin panel, no published filter ───
    adminEditionsList: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const all = await db.select().from(newsletters).orderBy(newsletters.editionNumber, newsletters.sectionNumber);
      const map = /* @__PURE__ */ new Map();
      for (const n of all) {
        const ed = n.editionNumber ?? 1;
        if (!map.has(ed)) map.set(ed, []);
        map.get(ed).push(n);
      }
      return Array.from(map.entries()).sort(([a], [b]) => a - b).map(([editionNumber, items]) => ({
        editionNumber,
        newsletters: items
      }));
    }),
    create: adminProcedure.input(z2.object({
      titleEn: z2.string(),
      titleAr: z2.string(),
      contentEn: z2.string(),
      contentAr: z2.string(),
      issueNumber: z2.string().optional(),
      publishDate: z2.string().optional(),
      imageUrl: z2.string().optional(),
      published: z2.boolean().default(false)
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [maxRow] = await db.select({ maxEd: sql`COALESCE(MAX(editionNumber), 1)` }).from(newsletters);
      const currentEdition = Number(maxRow?.maxEd ?? 1);
      const [cntRow] = await db.select({ cnt: sql`COUNT(*)` }).from(newsletters).where(and(eq2(newsletters.editionNumber, currentEdition), eq2(newsletters.published, true)));
      const countInEdition = Number(cntRow?.cnt ?? 0);
      const newEditionNumber = countInEdition >= 10 ? currentEdition + 1 : currentEdition;
      const newSectionNumber = countInEdition >= 10 ? 1 : countInEdition + 1;
      await db.insert(newsletters).values({
        ...input,
        publishDate: input.publishDate ? new Date(input.publishDate) : /* @__PURE__ */ new Date(),
        editionNumber: newEditionNumber,
        sectionNumber: newSectionNumber
      });
      return { success: true, editionNumber: newEditionNumber, sectionNumber: newSectionNumber };
    }),
    update: adminProcedure.input(z2.object({
      id: z2.number(),
      titleEn: z2.string().optional(),
      titleAr: z2.string().optional(),
      contentEn: z2.string().optional(),
      contentAr: z2.string().optional(),
      issueNumber: z2.string().optional(),
      publishDate: z2.string().optional(),
      imageUrl: z2.string().optional(),
      published: z2.boolean().optional()
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, publishDate, ...data } = input;
      const updateData = { ...data };
      if (publishDate) updateData.publishDate = new Date(publishDate);
      await db.update(newsletters).set(updateData).where(eq2(newsletters.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(newsletters).where(eq2(newsletters.id, input.id));
      return { success: true };
    })
  }),
  // ─── Comments (open, no auth required) ───
  comments: router({
    list: publicProcedure.input(z2.object({ contentType: z2.string(), contentId: z2.string() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(comments).where(and(eq2(comments.contentType, input.contentType), eq2(comments.contentId, input.contentId))).orderBy(desc(comments.createdAt));
    }),
    create: publicProcedure.input(z2.object({
      contentType: z2.string(),
      contentId: z2.string(),
      text: z2.string().min(1),
      userName: z2.string().min(1)
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const editToken = crypto.randomBytes(32).toString("hex");
      await db.insert(comments).values({ ...input, editToken });
      const [row] = await db.select().from(comments).where(and(eq2(comments.contentType, input.contentType), eq2(comments.contentId, input.contentId), eq2(comments.editToken, editToken))).orderBy(desc(comments.id)).limit(1);
      return { id: row?.id, editToken };
    }),
    update: publicProcedure.input(z2.object({ id: z2.number(), text: z2.string().min(1), editToken: z2.string() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [existing] = await db.select().from(comments).where(eq2(comments.id, input.id));
      if (!existing || existing.editToken !== input.editToken) throw new Error("Unauthorized");
      await db.update(comments).set({ text: input.text }).where(eq2(comments.id, input.id));
      return { success: true };
    }),
    listAll: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(comments).orderBy(desc(comments.createdAt));
    }),
    adminDelete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(comments).where(eq2(comments.id, input.id));
      return { success: true };
    })
  }),
  // ─── Ratings (open, no auth required) ───
  ratings: router({
    get: publicProcedure.input(z2.object({ contentType: z2.string(), contentId: z2.string() })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { average: 0, count: 0 };
      const rows = await db.select().from(ratings).where(and(eq2(ratings.contentType, input.contentType), eq2(ratings.contentId, input.contentId)));
      if (rows.length === 0) return { average: 0, count: 0 };
      const sum = rows.reduce((a, r) => a + r.value, 0);
      return { average: sum / rows.length, count: rows.length };
    }),
    submit: publicProcedure.input(z2.object({
      contentType: z2.string(),
      contentId: z2.string(),
      value: z2.number().min(1).max(5),
      guestName: z2.string().min(1)
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(ratings).values(input);
      return { success: true };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
var PROJECT_ROOT = process.cwd();
var LOG_DIR = path.join(PROJECT_ROOT, ".dev-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
var plugins = [react(), tailwindcss(), jsxLocPlugin()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "attached_assets")
    }
  },
  envDir: path.resolve(process.cwd()),
  root: path.resolve(process.cwd(), "client"),
  publicDir: path.resolve(process.cwd(), "client", "public"),
  build: {
    outDir: path.resolve(process.cwd(), "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        process.cwd(),
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = path2.resolve(process.cwd(), "dist", "public");
  console.log("Resolved distPath:", distPath);
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/pdf.ts
init_env();
import puppeteer from "puppeteer-core";
import { PDFDocument } from "pdf-lib";
import crypto2 from "crypto";
import fs2 from "fs";
import path3 from "path";
function loadLogoBase64() {
  const candidates = [
    path3.resolve(process.cwd(), "assets", "rta_logo.png"),
    path3.resolve(process.cwd(), "server", "assets", "rta_logo.png")
  ];
  for (const logoPath of candidates) {
    try {
      const logoBuffer = fs2.readFileSync(logoPath);
      return `data:image/png;base64,${logoBuffer.toString("base64")}`;
    } catch {
    }
  }
  console.warn("[PDF] Could not load RTA logo from disk, using CDN URL as fallback");
  return "/assets/images/rta_logo_transparent_b5d67b4d.png";
}
var RTA_LOGO_DATA_URI = loadLogoBase64();
var ARABIC_TRANSLITERATION = {
  "\u0627": "A",
  "\u0623": "A",
  "\u0625": "I",
  "\u0622": "Aa",
  "\u0628": "B",
  "\u062A": "T",
  "\u062B": "Th",
  "\u062C": "J",
  "\u062D": "H",
  "\u062E": "Kh",
  "\u062F": "D",
  "\u0630": "Dh",
  "\u0631": "R",
  "\u0632": "Z",
  "\u0633": "S",
  "\u0634": "Sh",
  "\u0635": "S",
  "\u0636": "D",
  "\u0637": "T",
  "\u0638": "Z",
  "\u0639": "A",
  "\u063A": "Gh",
  "\u0641": "F",
  "\u0642": "Q",
  "\u0643": "K",
  "\u0644": "L",
  "\u0645": "M",
  "\u0646": "N",
  "\u0647": "H",
  "\u0648": "W",
  "\u064A": "Y",
  "\u0649": "A",
  "\u0629": "H",
  "\u0626": "Y",
  "\u0624": "W",
  "\u0621": "",
  "\u0651": "",
  "\u064E": "",
  "\u064F": "",
  "\u0650": "",
  "\u064B": "",
  "\u064C": "",
  "\u064D": "",
  "\u0652": "",
  "\u0640": ""
};
function transliterateArabic(text2) {
  let result = "";
  for (const char of text2) {
    if (ARABIC_TRANSLITERATION[char] !== void 0) {
      result += ARABIC_TRANSLITERATION[char];
    } else if (/[a-zA-Z0-9]/.test(char)) {
      result += char;
    } else if (char === " ") {
      result += "-";
    }
  }
  return result.replace(/-+/g, "-").replace(/^-|-$/g, "") || "Document";
}
function slugify(text2) {
  if (/[\u0600-\u06FF]/.test(text2)) {
    return transliterateArabic(text2);
  }
  return text2.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "Document";
}
function generatePdfFilename(title, lang) {
  const slugTitle = slugify(title);
  const langLabel = lang === "ar" ? "AR" : "EN";
  const now = /* @__PURE__ */ new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  const hash = crypto2.randomBytes(3).toString("hex");
  return `${slugTitle}_${langLabel}_${date}_${time}_${hash}.pdf`;
}
function findChromiumPath() {
  const candidates = [
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable"
  ];
  for (const p of candidates) {
    if (fs2.existsSync(p)) return p;
  }
  throw new Error("Chromium not found. Install chromium or google-chrome.");
}
async function generatePdf(options) {
  const { pagePath, lang, contentType, contentTitle, serverPort } = options;
  const isRTL = lang === "ar";
  const publicSiteUrl = ENV.publicSiteUrl || "http://localhost:3000";
  const internalUrl = `http://localhost:${serverPort}${pagePath}`;
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: findChromiumPath(),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--font-render-hinting=none"
    ]
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    await page.evaluateOnNewDocument((langValue) => {
      localStorage.setItem("rta-lang", langValue);
    }, lang);
    await page.goto(internalUrl, {
      waitUntil: "networkidle2",
      timeout: 6e4
    });
    await page.waitForSelector("#root", { timeout: 15e3 });
    await new Promise((resolve) => setTimeout(resolve, 3e3));
    await page.evaluate((isRTLValue) => {
      document.documentElement.setAttribute("dir", isRTLValue ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", isRTLValue ? "ar" : "en");
      document.body.classList.add("pdf-generation-mode");
      const removeSelectors = [
        ".print-hidden",
        "[data-print-hide]",
        "header",
        "nav",
        ".fixed",
        "button",
        "input",
        "textarea",
        "select",
        ".back-to-top",
        '[role="navigation"]'
      ];
      removeSelectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      });
      document.querySelectorAll("footer").forEach((el) => el.remove());
      document.querySelectorAll(".absolute.inset-0").forEach((el) => el.remove());
      document.querySelectorAll('a[href="#section-1"]').forEach((el) => el.remove());
      document.querySelectorAll(
        'img[alt="RTA Logo"], img[alt="RTA"], img[alt*="Government of Dubai"], img[alt*="\u062D\u0643\u0648\u0645\u0629 \u062F\u0628\u064A"]'
      ).forEach((el) => el.remove());
      document.querySelectorAll("[style]").forEach((el) => {
        const htmlEl = el;
        if (htmlEl.style.opacity === "0") htmlEl.style.opacity = "1";
        if (htmlEl.style.transform) htmlEl.style.transform = "none";
      });
      document.querySelectorAll("img[loading]").forEach((img) => {
        img.removeAttribute("loading");
      });
      document.querySelectorAll(".space-y-3 > div").forEach((refDiv) => {
        const textSpan = refDiv.querySelector("span.text-gray-500, span.text-gray-600");
        if (textSpan) {
          textSpan.setAttribute("dir", "auto");
        }
        refDiv.querySelectorAll("a").forEach((a) => {
          a.setAttribute("dir", "ltr");
          a.style.unicodeBidi = "embed";
          a.style.textAlign = "left";
        });
      });
      document.querySelectorAll('section[id^="section-"]').forEach((section) => {
        const sectionEl = section;
        sectionEl.style.paddingTop = "0";
        sectionEl.style.paddingBottom = "1rem";
        sectionEl.classList.remove("scroll-mt-16");
      });
      document.querySelectorAll('section[id^="section-"] h2').forEach((h2) => {
        const h2El = h2;
        h2El.style.fontSize = "18px";
        h2El.style.lineHeight = "1.3";
      });
      document.querySelectorAll('section[id^="section-"] .w-10.h-10').forEach((badge) => {
        const badgeEl = badge;
        badgeEl.style.width = "28px";
        badgeEl.style.height = "28px";
        badgeEl.style.minWidth = "28px";
      });
    }, isRTL);
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images).filter((img) => !img.complete).map(
          (img) => new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          })
        )
      );
    });
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images).map(
          (img) => img.decode().catch(() => {
          })
        )
      );
    });
    const headerTitle = contentTitle || (isRTL ? "\u0645\u0633\u062A\u0646\u062F" : "Document");
    const dateStr = (/* @__PURE__ */ new Date()).toLocaleDateString(isRTL ? "ar-AE" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const typeLabels = {
      newsletter: { en: "AI Newsletter", ar: "\u0627\u0644\u0646\u0634\u0631\u0629 \u0627\u0644\u0625\u062E\u0628\u0627\u0631\u064A\u0629 \u0644\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A" },
      article: { en: "Article", ar: "\u0645\u0642\u0627\u0644" },
      poster: { en: "Poster", ar: "\u0645\u0644\u0635\u0642" }
    };
    const typeLabel = isRTL ? typeLabels[contentType]?.ar : typeLabels[contentType]?.en;
    const orgLabel = isRTL ? "\u0647\u064A\u0626\u0629 \u0627\u0644\u0637\u0631\u0642 \u0648\u0627\u0644\u0645\u0648\u0627\u0635\u0644\u0627\u062A" : "Roads & Transport Authority";
    const headerTemplate = `
      <style>
        .pdf-header {
          width: 100%;
          padding: 2mm 15mm 2mm 15mm;
          font-family: 'Noto Sans Arabic', 'Noto Sans', Arial, sans-serif;
          border-bottom: 1.5px solid #C8102E;
          display: flex;
          align-items: center;
          justify-content: space-between;
          direction: ${isRTL ? "rtl" : "ltr"};
          box-sizing: border-box;
          background: white;
          position: relative;
          z-index: 100;
        }
        .pdf-header-logo { height: 9mm; width: auto; }
        .pdf-header-org { font-size: 6.5pt; color: #003B71; font-weight: 600; }
        .pdf-header-type { font-size: 5.5pt; color: #999; }
        .pdf-header-title { font-size: 8pt; font-weight: 700; color: #003B71; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pdf-header-date { font-size: 6.5pt; color: #666; }
      </style>
      <div class="pdf-header">
        <div style="display: flex; align-items: center; gap: 6px; flex: 0 0 auto;">
          <img src="${RTA_LOGO_DATA_URI}" class="pdf-header-logo" />
          <div style="border-${isRTL ? "right" : "left"}: 1px solid #ddd; padding-${isRTL ? "right" : "left"}: 6px; margin-${isRTL ? "right" : "left"}: 2px;">
            <div class="pdf-header-org">${orgLabel}</div>
            <div class="pdf-header-type">${typeLabel}</div>
          </div>
        </div>
        <div style="flex: 1 1 auto; text-align: center;">
          <div class="pdf-header-title">${headerTitle}</div>
        </div>
        <div style="flex: 0 0 auto; text-align: ${isRTL ? "left" : "right"};">
          <div class="pdf-header-date">${dateStr}</div>
        </div>
      </div>
    `;
    const footerTemplate = `
      <style>
        .pdf-footer {
          width: 100%;
          padding: 2mm 15mm 4mm 15mm;
          font-family: 'Noto Sans Arabic', 'Noto Sans', Arial, sans-serif;
          border-top: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          direction: ${isRTL ? "rtl" : "ltr"};
          box-sizing: border-box;
          font-size: 7pt;
          color: #888;
        }
      </style>
      <div class="pdf-footer">
        <div>
          ${isRTL ? `\u0635\u0641\u062D\u0629 <span class="pageNumber"></span> \u0645\u0646 <span class="totalPages"></span>` : `Page <span class="pageNumber"></span> of <span class="totalPages"></span>`}
        </div>
        <div style="text-align: center;">
          ${publicSiteUrl ? `<span style="color: #003B71;">${publicSiteUrl}</span>` : ""}
        </div>
        <div style="text-align: ${isRTL ? "left" : "right"};">
          <span>${dateStr}</span>
        </div>
      </div>
    `;
    await page.addStyleTag({
      content: `
        @page {
          size: A4;
          margin: 0;
        }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          color: #1a1a1a !important;
          font-family: 'Noto Sans Arabic', 'Noto Sans', 'Inter', sans-serif !important;
          font-size: 11pt !important;
          line-height: 1.7 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body[dir="rtl"], [dir="rtl"] {
          text-align: right;
        }
        * {
          animation: none !important;
          transition: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
        .no-print, .print-hide, .print-hidden {
          display: none !important;
        }
        .page-break {
          page-break-before: always;
        }

        /* Prevent splitting of Final Note and References */
        table, figure, .card {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        section.bg-\\[\\#003B71\\] {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        section.bg-\\[\\#F5F5F5\\]:last-of-type,
        section.py-14.bg-\\[\\#F5F5F5\\] {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .space-y-3 > div {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        img {
          max-width: 100%;
          height: auto;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #003B71 !important;
          break-after: avoid;
          page-break-after: avoid;
        }

        /* Colored background sections */
        .bg-\\[\\#003B71\\] h1, .bg-\\[\\#003B71\\] h2, .bg-\\[\\#003B71\\] h3,
        .bg-\\[\\#C8102E\\] h1, .bg-\\[\\#C8102E\\] h2, .bg-\\[\\#C8102E\\] h3 {
          color: white !important;
        }
        .bg-\\[\\#003B71\\], .bg-\\[\\#003B71\\] * { color: white !important; }
        .bg-\\[\\#003B71\\] { background-color: #003B71 !important; -webkit-print-color-adjust: exact !important; }
        .bg-\\[\\#C8102E\\]:not([class*="\\/5"]):not([class*="\\/10"]), .bg-\\[\\#C8102E\\]:not([class*="\\/5"]):not([class*="\\/10"]) * { color: white !important; }
        .bg-\\[\\#C8102E\\]:not([class*="\\/5"]):not([class*="\\/10"]) { background-color: #C8102E !important; -webkit-print-color-adjust: exact !important; }
        .bg-\\[\\#F5F5F5\\] { background-color: #fafafa !important; }

        /* Callout boxes (INSIGHT/RESULT/CONCLUSION) - ensure readable in print */
        .bg-\\[\\#C8102E\\]\\/5 {
          background-color: #fef2f2 !important;
          -webkit-print-color-adjust: exact !important;
        }
        .bg-\\[\\#C8102E\\]\\/5 * {
          color: #1a1a1a !important;
        }
        .bg-\\[\\#C8102E\\]\\/5 .text-\\[\\#C8102E\\] {
          color: #C8102E !important;
        }

        .sticky { position: static !important; }
        .grid { display: block !important; }
        .grid > * { margin-bottom: 0.8rem; }
        .overflow-hidden { overflow: visible !important; }
        .min-h-screen { min-height: auto !important; }
        [class*="shadow"] { box-shadow: none !important; }

        table { width: 100% !important; max-width: 100% !important; table-layout: fixed !important; word-wrap: break-word; }
        td, th { padding: 4px 6px; font-size: 9pt; }

        /* Section styling for print - remove backgrounds that bleed into margin area */
        section[id^="section-"] {
          margin-top: 0 !important;
          padding-top: 1.5rem !important;
          padding-bottom: 1rem !important;
          border-top: none !important;
          background: transparent !important;
        }
        section[id^="section-"]:not(:first-of-type) {
          border-top: 2px solid #C8102E !important;
          margin-top: 1rem !important;
        }
        section[id^="section-"] h2 {
          break-after: avoid;
          page-break-after: avoid;
        }

        a[href]::after { content: none !important; }
        a { text-decoration: none !important; color: #003B71 !important; }
        p, li, td { orphans: 3; widows: 3; }

        /* Bidi handling for references */
        [dir="auto"] {
          unicode-bidi: plaintext;
        }
        a[dir="ltr"] {
          unicode-bidi: embed;
          direction: ltr;
          text-align: left;
        }
      `
    });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: {
        top: "42mm",
        bottom: "22mm",
        left: "15mm",
        right: "15mm"
      },
      preferCSSPageSize: false
    });
    await browser.close();
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    pdfDoc.setTitle(contentTitle || typeLabel || "Document");
    pdfDoc.setSubject(
      `${typeLabel} - ${isRTL ? "\u0647\u064A\u0626\u0629 \u0627\u0644\u0637\u0631\u0642 \u0648\u0627\u0644\u0645\u0648\u0627\u0635\u0644\u0627\u062A" : "Roads & Transport Authority"}`
    );
    pdfDoc.setAuthor("RTA HR department");
    pdfDoc.setCreator("Etisalat Academy");
    pdfDoc.setProducer("Etisalat Academy");
    pdfDoc.setKeywords([
      isRTL ? "\u0647\u064A\u0626\u0629 \u0627\u0644\u0637\u0631\u0642 \u0648\u0627\u0644\u0645\u0648\u0627\u0635\u0644\u0627\u062A" : "RTA",
      isRTL ? "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A" : "AI",
      contentType
    ]);
    const finalPdfBytes = await pdfDoc.save();
    return Buffer.from(finalPdfBytes);
  } catch (error) {
    await browser.close();
    throw error;
  }
}

// server/pdfRoute.ts
function registerPdfRoute(app, getPort) {
  app.get("/api/pdf", async (req, res) => {
    try {
      const {
        path: pagePath,
        lang = "en",
        contentType = "newsletter",
        contentTitle = "Document"
      } = req.query;
      if (!pagePath) {
        res.status(400).json({ error: "Missing required parameter: path" });
        return;
      }
      const validTypes = ["newsletter", "article", "poster"];
      const safeContentType = validTypes.includes(contentType) ? contentType : "newsletter";
      const safeLang = lang === "ar" ? "ar" : "en";
      const serverPort = getPort();
      const pdfBuffer = await generatePdf({
        pagePath,
        lang: safeLang,
        contentType: safeContentType,
        contentTitle,
        serverPort
      });
      const filename = generatePdfFilename(contentTitle, safeLang);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
      );
      res.setHeader("Content-Length", pdfBuffer.length);
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.send(pdfBuffer);
    } catch (error) {
      console.error("[PDF Generation Error]", error);
      res.status(500).json({
        error: "Failed to generate PDF",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}

// server/adminLogin.ts
init_db();
var ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "RTA@2026!";
var ADMIN_OPEN_ID = process.env.OWNER_OPEN_ID || "local-admin-001";
function registerAdminLoginRoute(app) {
  app.post("/api/admin-login", async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    try {
      await upsertUser({
        openId: ADMIN_OPEN_ID,
        name: "Admin",
        email: "admin@rta.ae",
        loginMethod: "local",
        role: "admin",
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(ADMIN_OPEN_ID, {
        name: "Admin",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
        sameSite: "lax"
        // Allow same-site for local development
      });
      res.json({ success: true, redirect: "/admin" });
    } catch (error) {
      console.error("[AdminLogin] Failed:", error);
      res.status(500).json({ error: "Login failed. Check server configuration." });
    }
  });
  app.get("/admin-login", (_req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RTA Admin Login</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #003B71;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-card {
      background: white;
      border-radius: 12px;
      padding: 48px 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo img { height: 60px; }
    h1 {
      text-align: center;
      color: #003B71;
      font-size: 24px;
      margin-bottom: 8px;
    }
    .subtitle {
      text-align: center;
      color: #666;
      font-size: 14px;
      margin-bottom: 32px;
    }
    .form-group { margin-bottom: 20px; }
    label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
    }
    input {
      width: 100%;
      padding: 12px 16px;
      border: 1.5px solid #ddd;
      border-radius: 8px;
      font-size: 15px;
      transition: border-color 0.2s;
      outline: none;
    }
    input:focus { border-color: #C8102E; }
    button {
      width: 100%;
      padding: 14px;
      background: #C8102E;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #a00d24; }
    button:disabled { background: #ccc; cursor: not-allowed; }
    .error {
      color: #C8102E;
      text-align: center;
      font-size: 14px;
      margin-top: 16px;
      display: none;
    }
    .back-link {
      text-align: center;
      margin-top: 20px;
    }
    .back-link a {
      color: #003B71;
      text-decoration: none;
      font-size: 13px;
    }
    .back-link a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="login-card">
    <div class="logo">
      <img src="/assets/images/rta_logo_transparent_b5d67b4d.png" alt="RTA Logo">
    </div>
    <h1>Admin Panel</h1>
    <p class="subtitle">Sign in to manage content</p>
    <form id="loginForm">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" placeholder="Enter username" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter password" required>
      </div>
      <button type="submit" id="submitBtn">Sign In</button>
      <p class="error" id="errorMsg"></p>
    </form>
    <div class="back-link">
      <a href="/">&larr; Back to website</a>
    </div>
  </div>
  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const errEl = document.getElementById('errorMsg');
      btn.disabled = true;
      btn.textContent = 'Signing in...';
      errEl.style.display = 'none';
      try {
        const res = await fetch('/api/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          window.location.href = '/admin';
        } else {
          errEl.textContent = data.error || 'Login failed';
          errEl.style.display = 'block';
        }
      } catch (err) {
        errEl.textContent = 'Connection error. Is the server running?';
        errEl.style.display = 'block';
      }
      btn.disabled = false;
      btn.textContent = 'Sign In';
    });
  </script>
</body>
</html>`);
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  registerAdminLoginRoute(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  let currentPort = 3e3;
  registerPdfRoute(app, () => currentPort);
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  currentPort = port;
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  const dbPatch = async () => {
    try {
      const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { sql: sql2 } = await import("drizzle-orm");
      const db = await getDb2();
      if (db) {
        await db.execute(sql2`UPDATE videos SET duration = '1:50', videoUrl = '/assets/videos/Quantum-City-V2 Ffc07ff5.mp4' WHERE videoUrl LIKE '%quantum-city%'`);
        await db.execute(sql2`UPDATE videos SET duration = '2:17', videoUrl = '/assets/videos/Rta-Video-2-Smart-City-Indicators D6200346.mp4' WHERE videoUrl LIKE '%rta-video-2%'`);
      }
    } catch (e) {
      console.error("Duration patch failed:", e);
    }
  };
  await dbPatch();
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
