import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerPdfRoute } from "../pdfRoute";
import { registerAdminLoginRoute } from "../adminLogin";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // Local admin login (username/password bypass for self-hosted)
  registerAdminLoginRoute(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // PDF generation endpoint (must be registered BEFORE Vite middleware)
  let currentPort = 3000;
  registerPdfRoute(app, () => currentPort);

  // development mode uses Vite, production mode uses static files
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
      const { getDb } = await import("../db.js");
      const { sql } = await import("drizzle-orm");
      const db = await getDb();
      if (db) {
        await db.execute(sql`UPDATE videos SET duration = '1:50' WHERE videoUrl LIKE '%quantum-city%'`);
        await db.execute(sql`UPDATE videos SET duration = '2:17' WHERE videoUrl LIKE '%rta-video-2%'`);
      }
    } catch(e) { console.error("Duration patch failed:", e) }
  };
  await dbPatch();

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
