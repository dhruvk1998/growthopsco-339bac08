## Goal

Replace the text "Freshworks | LeadSquared" on the site's Open Graph / social-preview thumbnail with "CRM Strategy • Workflow Automation • Revenue Operations", preserving the existing design, and wire the new image into the site's meta tags.

## Where the thumbnail lives today

- The thumbnail is **not** in `src/assets/`. The only file there is `hero-dashboard.jpg` (the Hero section image — will not be touched).
- The OG image is referenced from `src/routes/__root.tsx` (lines 90–91) as an external URL:
  - `og:image` → `https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/15725e39-02fb-4cc0-8c2a-23b8fa518561`
  - `twitter:image` → same URL
- Confirmed dimensions: **1344 × 768 PNG** (downloaded and inspected).

This image is used as the Open Graph / Twitter Card social preview thumbnail across all routes via the root `head()`. No other reference exists in the codebase.

## Changes

### 1. Edit the thumbnail image

Use `imagegen--edit_image` on the downloaded current thumbnail (`/tmp/og.png`) with a prompt that:

- Removes the existing "Freshworks | LeadSquared" text exactly where it sits.
- Adds "CRM Strategy • Workflow Automation • Revenue Operations" in the same position, using the same typography, color, weight, letter-spacing, and visual hierarchy.
- Keeps everything else identical: background, gradients, name/title, photo, decorative elements, spacing, padding, 1344×768 dimensions.

Save to `src/assets/og-thumbnail.png`.

### 2. QA the edited image

Open the generated PNG and visually verify:
- Old text is fully gone (no ghosting / partial letters).
- New text fits inside the original text band without overflowing or crowding adjacent elements.
- Style matches (same font family/weight/color, same alignment).
- Dimensions remain 1344×768.

If any issue is found, re-run the edit with a refined prompt before continuing.

### 3. Externalize to the CDN

Run `lovable-assets create --file src/assets/og-thumbnail.png > src/assets/og-thumbnail.png.asset.json`, then delete the local PNG. The pointer JSON gives us a stable CDN URL of the form `/__l5e/assets-v1/{asset_id}/og-thumbnail.png`, which absolute-resolves against the published domain for crawlers.

### 4. Update meta references

In `src/routes/__root.tsx`, replace both:
- `og:image` content
- `twitter:image` content

with the absolute URL `https://growthopsco.lovable.app/__l5e/assets-v1/{asset_id}/og-thumbnail.png` (OG/Twitter crawlers require absolute URLs). The `asset_id` comes from the `.asset.json` written in step 3.

### 5. Out of scope (explicitly NOT changed)

- `src/components/site/Hero.tsx` — untouched.
- `src/assets/hero-dashboard.jpg` — untouched.
- Page layouts, copy on Home/About/Services/etc. — untouched.
- The "Freshworks" / "LeadSquared" strings still present in body copy and JSON-LD `knowsAbout` (`src/routes/__root.tsx` description/og:description/twitter:description, `src/routes/index.tsx`) — out of scope for this request, which is specifically about the thumbnail image. Happy to follow up if you want those broadened too.

## Validation

- Confirm the modified asset: `src/assets/og-thumbnail.png.asset.json`.
- Confirm usage: `og:image` and `twitter:image` in `src/routes/__root.tsx` now point to the new CDN URL.
- Open the new PNG to confirm the new tagline renders cleanly with the original design intact.
- Confirm no edits to `Hero.tsx`, `hero-dashboard.jpg`, or any route/page layout files.
