import { describe, expect, it } from "vitest";
import { buildSitemap } from "./sitemap";

describe("public sitemap", () => {
  it("uses the published project origin for every existing public entry", () => {
    const locations = [...buildSitemap().matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    expect(locations).toEqual([
      "https://growthopsco.lovable.app/",
      "https://growthopsco.lovable.app/services",
      "https://growthopsco.lovable.app/about",
      "https://growthopsco.lovable.app/case-studies",
      "https://growthopsco.lovable.app/contact",
      "https://growthopsco.lovable.app/framework",
      "https://growthopsco.lovable.app/crm-assessment",
    ]);
  });

  it("keeps the diagnostic request page unlisted", () => {
    expect(buildSitemap()).not.toContain("/crm-revenue-diagnostic");
  });

  it("does not invent lastmod dates from generation time", () => {
    expect(buildSitemap()).not.toContain("<lastmod>");
  });
});