import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://growthopsco.vercel.app";

const pages = [
  { path: "/",               priority: "1.0", changefreq: "monthly" },
  { path: "/services",       priority: "0.9", changefreq: "monthly" },
  { path: "/about",          priority: "0.8", changefreq: "monthly" },
  { path: "/case-studies",   priority: "0.8", changefreq: "monthly" },
  { path: "/contact",        priority: "0.8", changefreq: "monthly" },
  { path: "/framework",      priority: "0.7", changefreq: "monthly" },
  { path: "/crm-assessment", priority: "0.7", changefreq: "monthly" },
];

const lastmod = new Date().toISOString().split("T")[0];

function buildSitemap(): string {
  const urls = pages
    .map(
      (p) =>
        `  <url>\n    <loc>${SITE_URL}${p.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(buildSitemap(), {
          status: 200,
          headers: {
            "Content-Type": "text/xml; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
            "X-Robots-Tag": "noindex",
          },
        });
      },
    },
  },
});
