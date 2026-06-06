import { useLanguage } from "@/contexts/LanguageContext";
import { LOGO_URL } from "@/data/newsletter";
import { Printer } from "lucide-react";

interface PrintButtonProps {
  className?: string;
  contentType: "newsletter" | "article" | "poster";
  contentTitle?: string;
  version?: string;
}

/**
 * Generates the PDF filename based on the rule:
 * Format: "Activity Type - Language"
 * Examples: "Newsletter - EN", "Article - AR", "Poster - EN"
 */
function generatePdfFilename(contentType: string, lang: string): string {
  const typeLabel = contentType.charAt(0).toUpperCase() + contentType.slice(1);
  const langLabel = lang === "ar" ? "AR" : "EN";
  return `${typeLabel} - ${langLabel}`;
}

/**
 * PrintButton — Opens a new window for printing with:
 * 1. Correct PDF filename (document.title = "Activity Type - Language")
 * 2. RTA branded header at the top
 * 3. Clean layout without navigation, logos, or interactive elements
 * 4. No browser URL/date in footer (@page margin:0)
 */
export default function PrintButton({
  className = "",
  contentType,
  contentTitle,
  version: _version,
}: PrintButtonProps) {
  const { t, lang } = useLanguage();

  const handlePrint = () => {
    const pdfFilename = generatePdfFilename(contentType, lang);
    const isRTL = lang === "ar";
    const today = new Date().toLocaleDateString(isRTL ? "ar-AE" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Collect all stylesheets
    const styleSheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));
    let stylesHtml = "";
    styleSheets.forEach((el) => {
      stylesHtml += el.outerHTML;
    });

    // Clone the page content
    const rootEl = document.getElementById("root");
    if (!rootEl) return;
    const contentClone = rootEl.cloneNode(true) as HTMLElement;

    // Remove elements that should be hidden in print
    const printHiddenEls = contentClone.querySelectorAll(
      '.print-hidden, [data-print-hide], header, footer, nav, .fixed, button, input, textarea, [role="navigation"]'
    );
    printHiddenEls.forEach((el) => el.remove());

    // Remove all logo images (except we'll add our own branded header)
    const logos = contentClone.querySelectorAll(
      'img[alt="RTA Logo"], img[alt="RTA"], img[alt*="Government of Dubai"]'
    );
    logos.forEach((el) => el.remove());

    // Remove site footers
    const footers = contentClone.querySelectorAll("footer");
    footers.forEach((el) => el.remove());

    // Remove decorative absolute overlays
    const decorative = contentClone.querySelectorAll(".absolute.inset-0");
    decorative.forEach((el) => el.remove());

    // Remove "Read Now" CTA links
    const ctas = contentClone.querySelectorAll('a[href="#section-1"]');
    ctas.forEach((el) => el.remove());

    const contentHtml = contentClone.innerHTML;

    // Build the RTA branded header
    const typeLabels: Record<string, { en: string; ar: string }> = {
      newsletter: { en: "AI Newsletter", ar: "النشرة الإخبارية للذكاء الاصطناعي" },
      article: { en: "Article", ar: "مقال" },
      poster: { en: "Poster", ar: "ملصق" },
    };
    const headerTitle = isRTL ? typeLabels[contentType].ar : typeLabels[contentType].en;
    const headerSubtitle = contentTitle || "";
    const rtaLabel = isRTL ? "هيئة الطرق والمواصلات" : "Roads & Transport Authority";

    const printHeaderHtml = `
      <div class="print-header print-only" style="display:flex !important; visibility:visible !important; align-items:center; justify-content:space-between; padding-bottom:10px; margin-bottom:16px; border-bottom:2px solid #C8102E;">
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${LOGO_URL}" alt="RTA" class="print-header-logo" style="display:block !important; visibility:visible !important; height:28px !important; width:auto !important; max-height:28px !important; max-width:120px !important; margin:0 !important; opacity:1 !important;" />
          <div style="border-${isRTL ? "right" : "left"}:1px solid #e5e5e5; padding-${isRTL ? "right" : "left"}:10px;">
            <div style="font-size:8pt; color:#003B71; font-weight:600;">${rtaLabel}</div>
          </div>
        </div>
        <div class="print-header-text" style="display:block !important; visibility:visible !important; text-align:${isRTL ? "left" : "right"};">
          <div class="print-header-title" style="font-weight:700; font-size:10pt; color:#003B71;">${headerTitle}</div>
          ${headerSubtitle ? `<div class="print-header-meta" style="font-size:8pt; color:#666;">${headerSubtitle}</div>` : ""}
          <div class="print-header-meta" style="font-size:8pt; color:#666;">${today}</div>
        </div>
      </div>
    `;

    // Open new window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      // Fallback: if popup blocked, set title and print directly
      const originalTitle = document.title;
      document.title = pdfFilename;
      setTimeout(() => {
        window.print();
        setTimeout(() => { document.title = originalTitle; }, 1000);
      }, 300);
      return;
    }

    // Write the print document
    printWindow.document.write(`<!DOCTYPE html>
<html lang="${lang}" dir="${isRTL ? "rtl" : "ltr"}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pdfFilename}</title>
  ${stylesHtml}
  <style>
    /* Print window overrides */
    @page {
      margin: 0 !important;
      size: A4;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      color: #1a1a1a !important;
      font-size: 12pt !important;
      line-height: 1.7 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    #print-root {
      padding: 18mm 15mm 20mm 15mm !important;
    }

    /* Force all content visible */
    * {
      opacity: 1 !important;
      transform: none !important;
      visibility: visible !important;
      animation: none !important;
      transition: none !important;
    }

    /* Hide interactive elements */
    .print-hidden, [data-print-hide], header, footer, nav, .fixed, button, input, textarea {
      display: none !important;
    }

    /* Colored backgrounds */
    [class*="bg-[#003B71]"] {
      background-color: #003B71 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    [class*="bg-[#003B71]"], [class*="bg-[#003B71]"] * {
      color: #ffffff !important;
    }
    [class*="bg-[#C8102E]"] {
      background-color: #C8102E !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    [class*="bg-[#C8102E]"]:not([class*="bg-[#C8102E]/"]),
    [class*="bg-[#C8102E]"]:not([class*="bg-[#C8102E]/"]) * {
      color: #ffffff !important;
    }

    /* Callout boxes (light pink bg with dark text - MUST be readable) */
    [class*="bg-[#C8102E]/5"],
    [class*="bg-[#C8102E]/5"] * {
      background-color: #fef2f2 !important;
      color: #003B71 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    [class*="bg-[#C8102E]/5"] .text-\[\#C8102E\] {
      color: #C8102E !important;
    }

    /* Table headers */
    th[class*="bg-[#003B71]"] {
      background-color: #003B71 !important;
      color: white !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Gray backgrounds → white */
    [class*="bg-[#F5F5F5]"] {
      background-color: white !important;
    }

    /* Headings */
    h1, h2, h3, h4, h5, h6 {
      color: #003B71 !important;
      break-after: avoid;
      margin-top: 0.8em;
      margin-bottom: 0.4em;
    }
    [class*="bg-[#003B71]"] h1, [class*="bg-[#003B71]"] h2, [class*="bg-[#003B71]"] h3,
    [class*="bg-[#C8102E]"] h1, [class*="bg-[#C8102E]"] h2, [class*="bg-[#C8102E]"] h3 {
      color: white !important;
    }

    /* Images — moderate size */
    img:not(.print-header-logo):not(.poster-print-img) {
      max-width: 60% !important;
      max-height: 200px !important;
      height: auto !important;
      width: auto !important;
      display: block !important;
      margin: 0.8rem auto !important;
      border-radius: 4px;
      break-inside: avoid;
    }

    .poster-print-img {
      max-height: 55vh !important;
      max-width: 80% !important;
      width: auto !important;
      height: auto !important;
      margin: 1rem auto !important;
      display: block !important;
      break-inside: avoid;
      border-radius: 4px;
    }

    /* Article hero image */
    .w-full.h-64, .w-full.h-72, .w-full.h-80, .w-full.object-cover {
      max-height: 180px !important;
      width: 100% !important;
      object-fit: cover !important;
      border-radius: 4px;
    }

    /* Layout */
    .sticky { position: static !important; }
    .grid { display: block !important; }
    .grid > * { margin-bottom: 0.8rem; }
    .overflow-hidden, [class*="overflow-hidden"] { overflow: visible !important; }
    .min-h-screen { min-height: auto !important; }
    [class*="shadow"] { box-shadow: none !important; }

    /* Section separators */
    section[id^="section-"] {
      break-inside: avoid;
      margin-top: 1.2rem;
      padding-top: 1rem;
      border-top: 1.5px solid #C8102E;
    }
    section#section-1 {
      border-top: none;
      margin-top: 0;
    }

    /* Typography */
    p, li, td {
      color: #1a1a1a !important;
      font-size: 11pt !important;
      line-height: 1.7 !important;
      orphans: 3;
      widows: 3;
    }
    [class*="bg-[#003B71]"] p, [class*="bg-[#003B71]"] li, [class*="bg-[#003B71]"] span {
      color: white !important;
    }
    [class*="bg-[#C8102E]"]:not([class*="bg-[#C8102E]/"]) p,
    [class*="bg-[#C8102E]"]:not([class*="bg-[#C8102E]/"]) li,
    [class*="bg-[#C8102E]"]:not([class*="bg-[#C8102E]/"]) span {
      color: white !important;
    }

    /* Links — no URL display */
    a[href]::after { content: none !important; }
    a { text-decoration: none !important; color: #003B71 !important; }
    [class*="bg-[#003B71]"] a, [class*="bg-[#C8102E]"]:not([class*="bg-[#C8102E]/"]) a { color: white !important; }
    a[href^="http"]:not([class]) { display: none !important; }

    /* Decorative elements */
    .absolute.inset-0 { display: none !important; }
    .h-0\\.5 { display: none !important; }
    a[href="#section-1"] { display: none !important; }

    /* White text classes */
    .text-white, .text-white\\/80, .text-white\\/50, .text-white\\/70 {
      color: white !important;
    }

    /* Accent colors */
    .text-\\[\\#C8102E\\] { color: #C8102E !important; }
    .text-\\[\\#003B71\\] { color: #003B71 !important; }

    /* Print header specific */
    .print-header {
      display: flex !important;
      visibility: visible !important;
    }
    .print-header-logo {
      display: block !important;
      visibility: visible !important;
      height: 28px !important;
      width: auto !important;
      max-height: 28px !important;
      max-width: 120px !important;
      margin: 0 !important;
      opacity: 1 !important;
    }
  </style>
</head>
<body>
  <div id="print-root">
    ${printHeaderHtml}
    ${contentHtml}
  </div>
</body>
</html>`);

    printWindow.document.close();

    // Wait for images to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
        setTimeout(() => {
          if (!printWindow.closed) printWindow.close();
        }, 60000);
      }, 1500);
    };

    // Fallback
    setTimeout(() => {
      if (!printWindow.closed) {
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      }
    }, 6000);
  };

  return (
    <div className="relative inline-block print-hidden">
      <button
        onClick={handlePrint}
        title={t("Print / Save as PDF", "طباعة / حفظ كـ PDF")}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#003B71] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#C8102E] hover:text-[#C8102E] transition-all duration-200 shadow-sm ${className}`}
      >
        <Printer className="w-4 h-4" />
        <span className="hidden sm:inline">{t("Print / PDF", "طباعة / PDF")}</span>
      </button>
    </div>
  );
}
