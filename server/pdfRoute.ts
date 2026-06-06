/**
 * Express route handler for PDF generation.
 * Provides /api/pdf endpoint that generates and streams PDF files.
 * Uses a dedicated Express route (not tRPC) because tRPC doesn't support binary streaming.
 */
import { type Express, type Request, type Response } from "express";
import { generatePdf, generatePdfFilename } from "./pdf";

/**
 * Register the /api/pdf route on the Express app.
 * @param app - Express application instance
 * @param getPort - Function that returns the current server port
 */
export function registerPdfRoute(app: Express, getPort: () => number) {
  app.get("/api/pdf", async (req: Request, res: Response) => {
    try {
      const {
        path: pagePath,
        lang = "en",
        contentType = "newsletter",
        contentTitle = "Document",
      } = req.query as {
        path?: string;
        lang?: string;
        contentType?: string;
        contentTitle?: string;
      };

      if (!pagePath) {
        res.status(400).json({ error: "Missing required parameter: path" });
        return;
      }

      // Validate contentType
      const validTypes = ["newsletter", "article", "poster"];
      const safeContentType = validTypes.includes(contentType)
        ? (contentType as "newsletter" | "article" | "poster")
        : "newsletter";

      // Validate lang
      const safeLang = lang === "ar" ? "ar" : "en";

      // Generate the PDF
      const serverPort = getPort();
      const pdfBuffer = await generatePdf({
        pagePath,
        lang: safeLang,
        contentType: safeContentType,
        contentTitle,
        serverPort,
      });

      // Generate unique filename
      const filename = generatePdfFilename(contentTitle, safeLang);

      // Set response headers for auto-download
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
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}
