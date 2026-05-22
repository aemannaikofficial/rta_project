/**
 * Server-side PDF generation using Puppeteer.
 * Generates professional A4 PDFs with:
 * - Bilingual support (Arabic RTL + English LTR)
 * - Embedded Arabic fonts (Noto Sans Arabic via system fonts)
 * - Repeating header/footer on every page (logo embedded as base64)
 * - Custom metadata (Author, Producer, Creator)
 * - Unique filenames with hash
 * - No references to development platforms
 */
import puppeteer from "puppeteer-core";
import { PDFDocument } from "pdf-lib";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { ENV } from "./_core/env";

/**
 * Load the RTA logo as a base64 data URI at module init time.
 */
function loadLogoBase64(): string {
  const candidates = [
    path.resolve(import.meta.dirname, "assets", "rta_logo.png"),
    path.resolve(process.cwd(), "server", "assets", "rta_logo.png"),
  ];
  for (const logoPath of candidates) {
    try {
      const logoBuffer = fs.readFileSync(logoPath);
      return `data:image/png;base64,${logoBuffer.toString("base64")}`;
    } catch {
      // try next
    }
  }
  console.warn("[PDF] Could not load RTA logo from disk, using CDN URL as fallback");
  return "/assets/images/rta_logo_transparent_b5d67b4d.png";
}

const RTA_LOGO_DATA_URI = loadLogoBase64();

/**
 * Arabic to Latin transliteration map for filename generation
 */
const ARABIC_TRANSLITERATION: Record<string, string> = {
  "ا": "A", "أ": "A", "إ": "I", "آ": "Aa", "ب": "B", "ت": "T", "ث": "Th",
  "ج": "J", "ح": "H", "خ": "Kh", "د": "D", "ذ": "Dh", "ر": "R", "ز": "Z",
  "س": "S", "ش": "Sh", "ص": "S", "ض": "D", "ط": "T", "ظ": "Z", "ع": "A",
  "غ": "Gh", "ف": "F", "ق": "Q", "ك": "K", "ل": "L", "م": "M", "ن": "N",
  "ه": "H", "و": "W", "ي": "Y", "ى": "A", "ة": "H", "ئ": "Y", "ؤ": "W",
  "ء": "", "ّ": "", "َ": "", "ُ": "", "ِ": "", "ً": "", "ٌ": "", "ٍ": "",
  "ْ": "", "ـ": "",
};

function transliterateArabic(text: string): string {
  let result = "";
  for (const char of text) {
    if (ARABIC_TRANSLITERATION[char] !== undefined) {
      result += ARABIC_TRANSLITERATION[char];
    } else if (/[a-zA-Z0-9]/.test(char)) {
      result += char;
    } else if (char === " ") {
      result += "-";
    }
  }
  return result.replace(/-+/g, "-").replace(/^-|-$/g, "") || "Document";
}

function slugify(text: string): string {
  if (/[\u0600-\u06FF]/.test(text)) {
    return transliterateArabic(text);
  }
  return text
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "Document";
}

/**
 * Generate a unique filename for the PDF
 * Format: {PageTitle}_{Lang}_{YYYY-MM-DD}_{HH-MM-SS}_{HASH}.pdf
 */
export function generatePdfFilename(title: string, lang: string): string {
  const slugTitle = slugify(title);
  const langLabel = lang === "ar" ? "AR" : "EN";
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  const hash = crypto.randomBytes(3).toString("hex");
  return `${slugTitle}_${langLabel}_${date}_${time}_${hash}.pdf`;
}

interface PdfOptions {
  pagePath: string;
  lang: string;
  contentType: "newsletter" | "article" | "poster";
  contentTitle: string;
  serverPort: number;
}

/**
 * Find the Chromium executable path
 */
function findChromiumPath(): string {
  const candidates = [
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error("Chromium not found. Install chromium or google-chrome.");
}

/**
 * Generate a PDF from a page using Puppeteer with repeating headers/footers.
 */
export async function generatePdf(options: PdfOptions): Promise<Buffer> {
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
      "--font-render-hinting=none",
    ],
  });

  try {
    const page = await browser.newPage();

    // Set viewport for print-quality rendering
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

    // Set language in localStorage before navigation
    await page.evaluateOnNewDocument((langValue: string) => {
      localStorage.setItem("rta-lang", langValue);
    }, lang);

    // Navigate - use networkidle2 because the dev server keeps HMR websocket connections open
    await page.goto(internalUrl, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Wait for React to render
    await page.waitForSelector("#root", { timeout: 15000 });
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Clean up the page for PDF rendering
    await page.evaluate((isRTLValue: boolean) => {
      document.documentElement.setAttribute("dir", isRTLValue ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", isRTLValue ? "ar" : "en");
      document.body.classList.add("pdf-generation-mode");

      // Remove non-printable elements
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
        '[role="navigation"]',
      ];
      removeSelectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      });

      // Remove site footer
      document.querySelectorAll("footer").forEach((el) => el.remove());

      // Remove decorative overlays
      document.querySelectorAll(".absolute.inset-0").forEach((el) => el.remove());

      // Remove "Read Now" CTA
      document.querySelectorAll('a[href="#section-1"]').forEach((el) => el.remove());

      // Remove logos from content (we add our own in header)
      document
        .querySelectorAll(
          'img[alt="RTA Logo"], img[alt="RTA"], img[alt*="Government of Dubai"], img[alt*="حكومة دبي"]'
        )
        .forEach((el) => el.remove());

      // Force all framer-motion elements to be visible
      document.querySelectorAll("[style]").forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.style.opacity === "0") htmlEl.style.opacity = "1";
        if (htmlEl.style.transform) htmlEl.style.transform = "none";
      });

      // Remove lazy loading from images
      document.querySelectorAll("img[loading]").forEach((img) => {
        img.removeAttribute("loading");
      });

      // Bidi fix: Wrap reference text in dir="auto" containers
      document.querySelectorAll(".space-y-3 > div").forEach((refDiv) => {
        const textSpan = refDiv.querySelector("span.text-gray-500, span.text-gray-600");
        if (textSpan) {
          (textSpan as HTMLElement).setAttribute("dir", "auto");
        }
        refDiv.querySelectorAll("a").forEach((a) => {
          a.setAttribute("dir", "ltr");
          a.style.unicodeBidi = "embed";
          a.style.textAlign = "left";
        });
      });

      // Restructure section headers for print
      document.querySelectorAll('section[id^="section-"]').forEach((section) => {
        const sectionEl = section as HTMLElement;
        sectionEl.style.paddingTop = "0";
        sectionEl.style.paddingBottom = "1rem";
        sectionEl.classList.remove("scroll-mt-16");
      });

      // Reduce section heading sizes for print
      document.querySelectorAll('section[id^="section-"] h2').forEach((h2) => {
        const h2El = h2 as HTMLElement;
        h2El.style.fontSize = "18px";
        h2El.style.lineHeight = "1.3";
      });

      // Reduce section number badge size
      document.querySelectorAll('section[id^="section-"] .w-10.h-10').forEach((badge) => {
        const badgeEl = badge as HTMLElement;
        badgeEl.style.width = "28px";
        badgeEl.style.height = "28px";
        badgeEl.style.minWidth = "28px";
      });
    }, isRTL);

    // Wait for all images to load
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              })
          )
      );
    });

    // Additional wait for image decoding
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images).map((img) =>
          img.decode().catch(() => {})
        )
      );
    });

    // Build header and footer HTML
    const headerTitle = contentTitle || (isRTL ? "مستند" : "Document");
    const dateStr = new Date().toLocaleDateString(isRTL ? "ar-AE" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const typeLabels: Record<string, { en: string; ar: string }> = {
      newsletter: { en: "AI Newsletter", ar: "النشرة الإخبارية للذكاء الاصطناعي" },
      article: { en: "Article", ar: "مقال" },
      poster: { en: "Poster", ar: "ملصق" },
    };
    const typeLabel = isRTL ? typeLabels[contentType]?.ar : typeLabels[contentType]?.en;
    const orgLabel = isRTL ? "هيئة الطرق والمواصلات" : "Roads & Transport Authority";

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
          ${isRTL ? `صفحة <span class="pageNumber"></span> من <span class="totalPages"></span>` : `Page <span class="pageNumber"></span> of <span class="totalPages"></span>`}
        </div>
        <div style="text-align: center;">
          ${publicSiteUrl ? `<span style="color: #003B71;">${publicSiteUrl}</span>` : ""}
        </div>
        <div style="text-align: ${isRTL ? "left" : "right"};">
          <span>${dateStr}</span>
        </div>
      </div>
    `;

    // Inject print-optimized styles
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
      `,
    });

    // Generate the PDF
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
        right: "15mm",
      },
      preferCSSPageSize: false,
    });

    await browser.close();

    // Set custom PDF metadata using pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    pdfDoc.setTitle(contentTitle || typeLabel || "Document");
    pdfDoc.setSubject(
      `${typeLabel} - ${isRTL ? "هيئة الطرق والمواصلات" : "Roads & Transport Authority"}`
    );
    pdfDoc.setAuthor("RTA HR department");
    pdfDoc.setCreator("Etisalat Academy");
    pdfDoc.setProducer("Etisalat Academy");
    pdfDoc.setKeywords([
      isRTL ? "هيئة الطرق والمواصلات" : "RTA",
      isRTL ? "الذكاء الاصطناعي" : "AI",
      contentType,
    ]);

    const finalPdfBytes = await pdfDoc.save();
    return Buffer.from(finalPdfBytes);
  } catch (error) {
    await browser.close();
    throw error;
  }
}
