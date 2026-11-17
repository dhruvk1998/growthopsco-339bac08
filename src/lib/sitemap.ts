const SITE_URL = "https://growthopsco.lovable.app";

const pages = [
  { path: "/", priority: "1.0", changefreq: "monthly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/case-studies", priority: "0.8", changefreq: "monthly" },
  { path: "/contact", priority: "0.8", changefreq: "monthly" },
  { path: "/framework", priority: "0.7", changefreq: "monthly" },
  { path: "/crm-assessment", priority: "0.7", changefreq: "monthly" },
];

// Preserve the existing public list and unlisted diagnostic exclusion.
const EXCLUDED_PATHS = new Set(["/crm-revenue-diagnostic"]);

export function buildSitemap(): string {
  const urls = pages
    .filter((page) => !EXCLUDED_PATHS.has(page.path))
    .map(
      (page) =>
        `  <url>\n    <loc>${SITE_URL}${page.path}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`,
    )
    .join("\n");
  // No authoritative page-specific modification timestamps are available.
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}