## Goal

Restore the proper multipage site (Home, About, Services, Framework, Case Studies, Contact each on their own route) so the footer only appears at the bottom of each page — but keep smooth anchor scrolling for in-page jumps (e.g. `/contact#consultation-form`, `/#featured-case-studies`).

## Root cause of the footer bug

Last change stacked About, Services, Framework, Case Studies and Contact onto `/` with anchor navigation. The footer rendered once at the bottom of that mega-page, so scrolling through "sections" surfaced the footer mid-experience.

## Changes

### 1. Homepage (`src/routes/index.tsx`)

Restore the original landing composition (remove About + Contact):

```text
Hero → WhoIHelp → HomeServicesPreview → Workflow → FeaturedCaseStudies → HealthCheck → FinalCTA
```

### 2. Navbar (`src/components/site/Navbar.tsx`) — route-based nav with mobile auto-close

| Item | Destination |
|---|---|
| Home | `/` |
| About | `/about` |
| Services | `/services` |
| Framework | `/framework` |
| Case Studies | `/case-studies` |
| Contact | `/contact` |
| Book CRM Strategy Call (CTA) | `/contact#consultation-form` |

Behaviors kept:
- Clicking Home while already on `/` smooth-scrolls to top.
- Mobile menu auto-closes after any selection.
- Anchor in CTA (`#consultation-form`) deep-links to the form and the existing Contact page logic auto-focuses the first field.

### 3. Hero CTAs (`src/components/site/Hero.tsx`)

- "Book a CRM Strategy Call" → `/contact#consultation-form` (route link).
- "See Case Studies" → in-page smooth scroll to `#featured-case-studies` (anchor on the same homepage).

### 4. FinalCTA (`src/components/site/FinalCTA.tsx`)

- "Schedule a Consultation" → `/contact#consultation-form`.
- "Explore Case Studies" → `/case-studies`.

### 5. FeaturedCaseStudies (`src/components/site/FeaturedCaseStudies.tsx`)

Revert the section id from `case-studies` back to `featured-case-studies` (was changed for the single-page version; on the homepage it's now just an in-page anchor target).

### 6. Styles (`src/styles.css`)

Keep:
- `html { scroll-behavior: smooth }` — so all `<a href="#...">` and same-page hash navigations scroll smoothly.
- `section[id] { scroll-margin-top: 80px }` — so any in-page anchor (e.g. `#consultation-form` on `/contact`) lands below the fixed 80px navbar instead of being hidden under it.

### 7. Cross-route anchor scrolling (TanStack Router)

When navigating from one route to another with a hash (e.g. Navbar CTA → `/contact#consultation-form`), TanStack Router scrolls to the matching `id` on mount. Combined with the `scroll-margin-top` rule above, this lands the user at the right spot under the fixed navbar. Contact page's existing `useEffect` on `#consultation-form` also focuses the first input after that scroll.

### 8. Unchanged

- `/about`, `/services`, `/framework`, `/case-studies`, `/contact` route files keep their existing content and `head()` metadata.
- `useReveal` runtime-error fix from the last change stays.

## Validation

- Each nav item loads its own route. Footer only appears at the bottom of the current route.
- Home stays a short landing page; footer no longer appears mid-scroll.
- "Book CRM Strategy Call" from any page navigates to `/contact`, smooth-scrolls to the consultation form, and focuses the first input.
- "See Case Studies" on the homepage smooth-scrolls down to the featured case studies block.
- Mobile menu auto-closes on every selection.
