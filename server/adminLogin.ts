/**
 * Local Admin Login — bypasses OAuth for self-hosted deployments.
 * 
 * Credentials are read from environment variables:
 *   ADMIN_USERNAME (default: "admin")
 *   ADMIN_PASSWORD (default: "RTA@2026!")
 * 
 * This creates a real session cookie so the admin panel works normally.
 */
import type { Express, Request, Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import * as db from "./db";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "RTA@2026!";
const ADMIN_OPEN_ID = process.env.OWNER_OPEN_ID || "local-admin-001";

export function registerAdminLoginRoute(app: Express) {
  // POST /api/admin-login — authenticate with username/password
  app.post("/api/admin-login", async (req: Request, res: Response) => {
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
      // Upsert the admin user in the database
      await db.upsertUser({
        openId: ADMIN_OPEN_ID,
        name: "Admin",
        email: "admin@rta.ae",
        loginMethod: "local",
        role: "admin",
        lastSignedIn: new Date(),
      });

      // Create a session token (JWT signed with JWT_SECRET)
      const sessionToken = await sdk.createSessionToken(ADMIN_OPEN_ID, {
        name: "Admin",
        expiresInMs: ONE_YEAR_MS,
      });

      // Set the session cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
        sameSite: "lax", // Allow same-site for local development
      });

      res.json({ success: true, redirect: "/admin" });
    } catch (error) {
      console.error("[AdminLogin] Failed:", error);
      res.status(500).json({ error: "Login failed. Check server configuration." });
    }
  });

  // GET /admin-login — serve a simple login page (HTML)
  app.get("/admin-login", (_req: Request, res: Response) => {
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
