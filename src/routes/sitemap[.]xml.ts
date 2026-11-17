import { createFileRoute } from "@tanstack/react-router";

import { buildSitemap } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(buildSitemap(), {
          status: 200,
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
        });
      },
    },
  },
});
