# RTA AI Content Hub — Approved Template Reference

**Approved Version:** 5b8d406d (April 20, 2026)
**Live URL:** https://rta-ai.com
**Status:** APPROVED — Do NOT deviate from this design.

---

## Header (All Pages)

- **Top bar:** White background
  - Left: RTA logo (full color, with Arabic + English "Roads & Transport Authority" text)
  - Next to RTA logo: Dubai Government red calligraphy logo (حكومة دبي + "GOVERNMENT OF DUBAI") — CDN URL: `https://d2xsxph8kpxj0f.cloudfront.net/310419663030440268/hWqPJQZpV4iDcAitzw8Ymn/dubai-gov-logo-updated_07bf5485.png`
  - Right: Language toggle (EN / عربي)
- **Navigation bar:** Red (#C8102E) background
  - Links: Home, Newsletter, Videos, Articles, Posters, Media Center
  - Right: Search icon (magnifying glass)
  - Active link: White background pill with red text
- **MUST be identical on ALL pages** — homepage, inside pages, newsletter reader

## Homepage (Editions.tsx)

- **Hero section:** Navy (#003B71) with Dubai cityscape banner image overlay
  - "AI CONTENT HUB" label in WHITE (#fffafb) with globe icon
  - "AI in Transport" large heading in white
  - Subtitle text in white/gray
  - Two CTAs: "Browse Newsletters" (red button), "Watch Videos" (dark button)
- **Content type bar:** 4 colored blocks (purple=Newsletters, green=Videos, teal=Articles, blue=Posters)
- **Content sections:** Newsletter Editions, Educational Videos, Latest Articles, Posters & Infographics
  - Each section has "View All" link
  - Content pulled from database

## Footer (All Pages — SiteFooter.tsx)

- **Dark navy (#003B71) background**
- **3-column layout:**
  - Left: RTA logo (full color) + mission statement text
  - Center: Quick links (Newsletter, Videos, Articles, Posters, Official RTA Website)
  - Right: "Contact Us" button linking to www.rta.ae
- **Red accent line** above copyright bar
- **Copyright bar:** "© 2026 Roads and Transport Authority, Dubai. All rights reserved."
- **MUST be identical on ALL pages**

## Newsletter Reader (Home.tsx / edition/:id)

- **3-tier header:** Compact red bar on scroll with section navigation
- **Hero:** Navy background with edition title, foreword excerpt
- **Table of Contents:** Grid of section links
- **Section blocks:** Alternating white/light gray backgrounds
- **Reading progress bar** at top

## Inside Pages (Videos, Articles, Posters)

- Use shared SiteHeader + SiteFooter
- Page hero: Navy background with page title and description
- Content grid with cards

## Arabic (RTL) Rules

- All text right-aligned in RTL mode
- **Tables in articles:** Text MUST be right-aligned (text-align: right) in RTL mode
- Navigation and layout flip for RTL
- Arabic font rendering with proper line-height

## Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | #003B71 | Primary backgrounds, headings |
| Red | #C8102E | CTAs, nav bar, accents |
| White | #FFFFFF | Text on dark, backgrounds |
| Light Gray | #F5F5F5 | Alternating section backgrounds |
| AI Hub Label | #fffafb | "AI CONTENT HUB" text on hero |

## Key Assets

| Asset | CDN URL |
|-------|---------|
| RTA Logo | Imported from `@/data/newsletter` as `LOGO_URL` |
| Dubai Gov Logo | `https://d2xsxph8kpxj0f.cloudfront.net/310419663030440268/hWqPJQZpV4iDcAitzw8Ymn/dubai-gov-logo-updated_07bf5485.png` |
| Banner Image | `https://d2xsxph8kpxj0f.cloudfront.net/310419663030440268/hWqPJQZpV4iDcAitzw8Ymn/rta-banner_e5d3a0e4.webp` |

## Critical Rules

1. **NEVER remove or change the Dubai Government logo** — it must always appear next to the RTA logo in the header
2. **NEVER change the header or footer structure** without explicit user approval
3. **NEVER replace shared components (SiteHeader, SiteFooter) with inline code** on individual pages
4. **Arabic tables MUST be right-aligned** in RTL mode
5. **All pages MUST use the same header and footer** — no page-specific variations
6. **When fixing one thing, NEVER break another** — always verify all pages after changes
