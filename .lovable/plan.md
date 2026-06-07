## Plan: UX Refinements

### 1. Home Navigation — Smooth Scroll to Top
**File:** `src/components/site/Navbar.tsx`
- Intercept the Home link click.
- If the user is already on `/`, call `window.scrollTo({ top: 0, behavior: 'smooth' })` instead of (or in addition to) standard router navigation.
- This ensures clicking Home from any scroll position on the homepage always returns to the Hero.

### 2. Mobile Navigation Menu — Auto-Close on Selection
**File:** `src/components/site/Navbar.tsx`
- Add an `onClick` handler to every mobile menu link that immediately sets `setOpen(false)`.
- Keep the existing `useEffect(() => { setOpen(false); }, [location.pathname])` as a fallback for hard navigations.
- This fixes the issue where same-page clicks (e.g., Home on homepage) leave the menu open.

### 3. Case Study Card Height Reduction
**File:** `src/components/site/FeaturedCaseStudies.tsx`
- Reduce flip card `min-h` from `420px` to `320px`.
- Reduce card padding from `p-8` to `p-6` on both front and back faces.
- Tighten internal spacing (e.g., `mt-5` → `mt-3`, `space-y-4` → `space-y-3`) to remove blank space between content blocks.
- Maintain the flip animation, border radius, and visual consistency.

### Files Modified
- `src/components/site/Navbar.tsx`
- `src/components/site/FeaturedCaseStudies.tsx`

### Deliverables After Implementation
A. Home scroll behavior updated and tested.
B. Mobile menu auto-close implemented for all links.
C. Case study card height reduction completed (estimated ~24% shorter).
D. Estimated page length reduction from tighter case study cards.