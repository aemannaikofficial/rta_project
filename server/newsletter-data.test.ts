import { describe, expect, it } from "vitest";
import { editions, getEdition, UI, LOGO_URL } from "../client/src/data/newsletter";
import type { Edition, Section } from "../client/src/data/newsletter";

describe("Newsletter Data Integrity", () => {
  it("exports at least one edition", () => {
    expect(editions.length).toBeGreaterThanOrEqual(1);
  });

  it("getEdition returns the correct edition by id", () => {
    const edition = getEdition("apr-2026");
    expect(edition).toBeDefined();
    expect(edition!.id).toBe("apr-2026");
    expect(edition!.number).toBe(1);
  });

  it("getEdition returns undefined for non-existent id", () => {
    const edition = getEdition("non-existent");
    expect(edition).toBeUndefined();
  });

  it("each edition has bilingual title and subtitle", () => {
    for (const edition of editions) {
      expect(edition.title.en).toBeTruthy();
      expect(edition.title.ar).toBeTruthy();
      expect(edition.subtitle.en).toBeTruthy();
      expect(edition.subtitle.ar).toBeTruthy();
    }
  });

  it("each section has bilingual title and shortTitle", () => {
    for (const edition of editions) {
      for (const section of edition.sections) {
        expect(section.title.en).toBeTruthy();
        expect(section.title.ar).toBeTruthy();
        expect(section.shortTitle.en).toBeTruthy();
        expect(section.shortTitle.ar).toBeTruthy();
      }
    }
  });

  it("sections with bullets have bilingual label and text for each bullet", () => {
    for (const edition of editions) {
      for (const section of edition.sections) {
        if (section.bullets) {
          expect(section.bullets.length).toBeGreaterThan(0);
          for (const bullet of section.bullets) {
            expect(bullet.label.en).toBeTruthy();
            expect(bullet.label.ar).toBeTruthy();
            expect(bullet.text.en).toBeTruthy();
            expect(bullet.text.ar).toBeTruthy();
          }
        }
      }
    }
  });

  it("sections with callouts have bilingual text", () => {
    for (const edition of editions) {
      for (const section of edition.sections) {
        if (section.callout) {
          expect(["insight", "result", "conclusion"]).toContain(section.callout.type);
          expect(section.callout.text.en).toBeTruthy();
          expect(section.callout.text.ar).toBeTruthy();
        }
      }
    }
  });

  it("sections with tables have bilingual headers and rows", () => {
    for (const edition of editions) {
      for (const section of edition.sections) {
        if (section.table) {
          expect(section.table.headers.length).toBeGreaterThan(0);
          for (const header of section.table.headers) {
            expect(header.en).toBeTruthy();
            expect(header.ar).toBeTruthy();
          }
          expect(section.table.rows.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("UI labels are bilingual", () => {
    const uiKeys = Object.keys(UI) as (keyof typeof UI)[];
    for (const key of uiKeys) {
      const label = UI[key];
      expect(label.en).toBeTruthy();
      expect(label.ar).toBeTruthy();
    }
  });

  it("LOGO_URL is a valid URL", () => {
    expect(LOGO_URL).toMatch(/^https?:\/\//);
  });

  it("each edition has at least 5 sections", () => {
    for (const edition of editions) {
      expect(edition.sections.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("each section has a valid image URL", () => {
    for (const edition of editions) {
      for (const section of edition.sections) {
        expect(section.image).toMatch(/^https?:\/\//);
      }
    }
  });

  it("each edition has references with valid structure", () => {
    for (const edition of editions) {
      expect(edition.references.length).toBeGreaterThan(0);
      for (const ref of edition.references) {
        expect(ref.id).toBeGreaterThan(0);
        expect(ref.text).toBeTruthy();
      }
    }
  });
});
