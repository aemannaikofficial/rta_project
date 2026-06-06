# RTA AI Newsletter — Self-Hosted Setup Guide

A bilingual (English/Arabic) newsletter and blog platform for the Roads & Transport Authority (RTA), Dubai. Features include a newsletter reader, articles, videos, posters sections, an admin panel, and server-side PDF export.

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 20+ | LTS recommended |
| pnpm | 9+ | Install: `npm install -g pnpm` |
| MySQL | 8.0+ | Or MariaDB 10.6+, or TiDB |
| Chromium | Latest | Required for PDF generation |

---

## Quick Start

### 1. Install Dependencies

```bash
cd project/
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and desired admin password:

```env
DATABASE_URL=mysql://root:yourpassword@localhost:3306/rta_newsletter
JWT_SECRET=generate-a-random-string-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=RTA@2026!
```

### 3. Create Database

Create the MySQL database:

```sql
CREATE DATABASE rta_newsletter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Push Schema

This creates all required tables:

```bash
pnpm db:push
```

### 5. Seed Data

Populate the database with initial content (posters, articles, videos):

```bash
node seed.mjs
```

### 6. Start Development Server

```bash
pnpm dev
```

The application will be available at **http://localhost:3000**

---

## Admin Access

Navigate to **http://localhost:3000/admin-login** and sign in with:

- **Username:** `admin` (or whatever you set in `ADMIN_USERNAME`)
- **Password:** `RTA@2026!` (or whatever you set in `ADMIN_PASSWORD`)

After login, you'll be redirected to the admin panel at `/admin` where you can manage:
- Editions (newsletter content)
- Users (role management)
- Posters, Articles, Videos (via database)

---

## Project Structure

```
project/
├── client/                  # Frontend (React 19 + Tailwind 4)
│   ├── public/
│   │   └── assets/
│   │       ├── images/      # All poster, article, and UI images
│   │       ├── videos/      # MP4 video files
│   │       └── uploads/     # User-uploaded files (created automatically)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Language, etc.)
│   │   ├── data/            # Newsletter content data
│   │   ├── pages/           # Page components
│   │   └── App.tsx          # Routes
│   └── index.html
├── server/                  # Backend (Express 4 + tRPC 11)
│   ├── _core/               # Framework internals (auth, context, etc.)
│   ├── adminLogin.ts        # Local admin login route
│   ├── db.ts                # Database query helpers
│   ├── pdf.ts               # Puppeteer PDF generation
│   ├── pdfRoute.ts          # PDF API endpoint
│   ├── routers.ts           # tRPC procedures
│   └── storage.ts           # File storage (local or S3)
├── drizzle/                 # Database schema & migrations
│   └── schema.ts            # Table definitions
├── shared/                  # Shared types & constants
├── seed.mjs                 # Database seed script
├── .env.example             # Environment template
├── package.json
└── SETUP.md                 # This file
```

---

## PDF Export

The platform includes server-side PDF generation using Puppeteer. PDFs include:

- RTA branded header with logo on every page
- Page numbers in footer
- Bilingual support (English LTR and Arabic RTL)
- Custom metadata: Author = "RTA HR department", Producer/Creator = "Etisalat Academy"

### PDF Requirements

Puppeteer requires Chromium. On Ubuntu/Debian:

```bash
sudo apt-get install -y chromium-browser
```

On macOS (via Homebrew):

```bash
brew install --cask chromium
```

The PDF endpoint expects Chromium at `/usr/bin/chromium-browser`. If your Chromium is at a different path, update the `executablePath` in `server/pdf.ts`.

---

## Production Build

```bash
# Build frontend + bundle server
pnpm build

# Start production server
NODE_ENV=production node dist/index.js
```

For production, ensure:
- `NODE_ENV=production` is set
- `PUBLIC_SITE_URL` points to your actual domain
- A reverse proxy (nginx/caddy) handles HTTPS termination
- Database is properly secured

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | MySQL connection string |
| `JWT_SECRET` | Yes | — | Secret for signing session tokens |
| `ADMIN_USERNAME` | No | `admin` | Local admin login username |
| `ADMIN_PASSWORD` | No | `RTA@2026!` | Local admin login password |
| `OWNER_OPEN_ID` | No | `local-admin-001` | Internal admin user ID |
| `OWNER_NAME` | No | `Admin` | Admin display name |
| `VITE_APP_ID` | No | `rta-newsletter-selfhosted` | Application identifier |
| `PUBLIC_SITE_URL` | No | `http://localhost:3000` | Site URL for PDF footer |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `BUILT_IN_FORGE_API_URL` | No | — | External storage API (optional) |
| `BUILT_IN_FORGE_API_KEY` | No | — | External storage key (optional) |

---

## Features

- **Newsletter Reader** — Full bilingual (EN/AR) newsletter with 10 sections, table of contents, reading progress, and smooth navigation
- **Articles** — Markdown-based articles with cover images, bilingual content, comments, and ratings
- **Videos** — Video gallery with thumbnails, descriptions, and playback
- **Posters** — Image gallery with EN/AR versions, descriptions, and full-screen viewing
- **Admin Panel** — Dashboard for managing content, users, and editions
- **PDF Export** — Server-side PDF generation with RTA branding and proper metadata
- **RTL Support** — Full right-to-left layout for Arabic content
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Comments & Ratings** — Public commenting and 5-star rating system
- **Local Authentication** — Username/password login (no external OAuth required)
- **Local Storage** — All assets served from local filesystem (no CDN dependency)

---

## Troubleshooting

### Database connection fails
- Verify MySQL is running: `systemctl status mysql`
- Check credentials in `.env`
- Ensure the database exists and user has permissions

### PDF generation fails
- Verify Chromium is installed: `chromium-browser --version`
- Check the path in `server/pdf.ts` matches your Chromium location
- Ensure sufficient memory (Puppeteer needs ~300MB)

### Images not loading
- Verify files exist in `client/public/assets/images/`
- Check browser console for 404 errors
- Ensure the dev server is serving static files correctly

### Admin login not working
- Verify `JWT_SECRET` is set in `.env`
- Check that `ADMIN_USERNAME` and `ADMIN_PASSWORD` match what you're entering
- Clear browser cookies and try again

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind CSS 4, Wouter, Framer Motion |
| Backend | Express 4, tRPC 11, Drizzle ORM |
| Database | MySQL 8+ (via mysql2 driver) |
| PDF | Puppeteer-core, pdf-lib |
| Build | Vite 7, esbuild, TypeScript 5.9 |
| Package Manager | pnpm 9 |

---

## License

Internal use only — Roads & Transport Authority, Dubai.
