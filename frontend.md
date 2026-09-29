# Skypixel Studio — Frontend Redesign Specification v2.0

> **Purpose of this document:** This is a prompt-ready specification to hand to an AI coding agent (or a developer) to restyle the existing Skypixel frontend. It supersedes the color, motion, and texture sections of `frontend.md` v1.0. Page structure, routing, data-fetching logic, and component architecture from v1.0 remain **unchanged** — only visual language and motion are being upgraded.
>
> **Directive to implementing AI:** Do not rebuild components from scratch. Apply these design tokens, animation patterns, and interaction rules on top of the existing React/TypeScript structure. Preserve all existing functionality (routing, forms, admin suite, lightbox logic).

---

## 0. What Is Changing and Why

The current build (coral-flame `#ee523d` on obsidian) is competent but generic — it reads as "dark portfolio template #4,812." The brand deserves a palette and motion language that feels like it was *directed*, not defaulted to.

**Changes in this revision:**
1. **Color:** Shift from coral/red-orange to a **warm gold & amber** system — still luxury, still cinematic, but more timeless and less "startup CTA orange." Gold reads as heirloom and craftsmanship; coral reads as tech marketing.
2. **Logo relationship:** The palette does **not** have to lock to the logo's exact colors. Treat the logo as a *fixed anchor point* that the UI orbits — it can blend seamlessly into the new gold system in most contexts, and stand apart as a deliberate accent in a few high-visibility moments (navbar, footer crest, loading state). See §2.4.
3. **Motion:** Move from "a few hover states" to a full **cinematic scroll-storytelling system** — parallax depth, staged reveals, scroll-scrubbed sequences, and signature transitions between routes. Motion should feel like the site is being *filmed*, not just *styled*.

---

## 1. Design Philosophy (Refined)

Keep the four core tenets from v1.0 (cinematic monumentality, editorial refinement, seamless content immersion, architectural separation), and add a fifth:

5. **Motion as Narration:** Nothing on the site should simply "appear." Every section entrance, image reveal, and page transition is choreographed to feel like a cut in a film — deliberate timing, deliberate easing, never mechanical or bouncy. The scroll bar is treated as a timeline scrubber, not just a means of navigation.

---

## 2. Color System v2.0 — Warm Gold & Amber Grade

Think "golden hour over a wedding venue at dusk" rather than "cinema mastering suite." Same obsidian base for contrast and legibility; the accent family shifts from flame-red to metallic gold/amber, which pairs more naturally with warm skin tones, gold jewelry, and candlelit wedding photography — the studio's actual subject matter.

### 2.1 Updated Color Tokens (`client/src/styles/index.css`)

```css
:root {
  /* Surface & Canvas — kept close to v1.0, slightly warmed */
  --bg-primary: #0a0806;         /* Warm-leaning obsidian (was cool blue-black) */
  --bg-secondary: #14100c;       /* Secondary canvas, card surfaces */
  --bg-card: rgba(28, 22, 16, 0.7);
  --bg-card-hover: rgba(38, 30, 20, 0.85);

  /* Brand Accents — NEW gold/amber system */
  --brand-gold: #d4a24e;         /* Primary signature gold — muted, metallic, not yellow */
  --brand-gold-bright: #e8bc6e;  /* Hover / active luminance boost */
  --brand-gold-deep: #a97c2f;    /* Pressed states, borders, low-emphasis accents */
  --brand-amber-glow: rgba(212, 162, 78, 0.30);  /* Outer glow for CTAs & focus rings */
  --brand-champagne: #f3e4c8;    /* Lightest accent — for text highlights, star ratings */
  --brand-ink-navy: #14181f;     /* Optional cool counterpoint — use sparingly for admin/data UI only */

  /* Typography Colors */
  --text-primary: #f9f5ee;       /* Warm off-white, not clinical white */
  --text-secondary: #a89a86;     /* Warm muted taupe */
  --text-muted: #6f6456;

  /* Borders & Glassmorphism */
  --border-subtle: rgba(255, 246, 230, 0.07);
  --border-light: rgba(255, 246, 230, 0.14);
  --border-gold: rgba(212, 162, 78, 0.35);
  --glass-bg: rgba(10, 8, 6, 0.78);
  --glass-border: rgba(212, 162, 78, 0.10);
}
```

### 2.2 Rationale for Every Shift
| Old (v1.0) | New (v2.0) | Why |
|---|---|---|
| `--bg-primary: #07090e` (blue-black) | `--bg-primary: #0a0806` (warm black) | Cool blacks fight warm skin tones and gold jewelry in wedding photography; a warm black lets photos breathe. |
| `--brand-coral: #ee523d` | `--brand-gold: #d4a24e` | Coral reads as "tech SaaS CTA." Gold reads as "heirloom, craftsmanship, luxury event." |
| Gold star ratings already existed (`#f59e0b`) | Now the *entire accent system*, not just stars | Unifies what was previously an inconsistent accent (coral buttons + gold stars) into one coherent metal tone. |

### 2.3 Usage Rules
- **One accent, three intensities:** `--brand-gold` for primary actions, `--brand-gold-deep` for borders/secondary, `--brand-champagne` for the lightest text highlights and italic emotional words in headlines. Never introduce a fourth accent hue.
- **Gold is earned, not everywhere:** Reserve saturated gold for CTAs, active states, and 1–2 focal accents per viewport. If more than ~15% of a screen is gold, pull it back — the obsidian base is what makes the gold feel expensive.
- **Admin suite exception:** The admin dashboard (`/admin/*`) may reintroduce cool tones (`--brand-ink-navy`, blues, greens for status pills) since it's a data-density interface, not a storytelling one. Don't force cinematic gold onto CRUD tables.

### 2.4 Logo Blending Strategy
Since the logo's own colors are fixed, use this rule set instead of trying to force an exact match:

- **Navbar & Footer (logo visible, small, high-frequency):** Let the logo sit on its own — don't recolor or filter it. Surround it with the new obsidian/gold chrome. The logo becomes the one "true color" anchor point the eye returns to.
- **Loading/splash states, admin login crest:** This is where the logo can *blend* — apply a subtle gold rim-light or backlight glow (`box-shadow` / radial gradient behind it in `--brand-amber-glow`) so it visually belongs to the new palette without altering the logo file itself.
- **Everywhere else (buttons, tags, backgrounds):** Use the new gold system independently. The logo doesn't need to dictate every accent color on the site — it needs to look at home *next to* them. Two adjacent warm hues (logo's native color + new gold) read as intentional, not mismatched, as long as neither is neon-saturated.
- **Do not** auto-recolor the logo asset to force a hex match — that usually looks worse than a confident, complementary near-miss.

---

## 3. Typography — No Structural Change, One Addition

Keep the existing three-font system from v1.0 (`Playfair Display` for editorial headings, `Cinzel` for eyebrows/monuments, `Plus Jakarta Sans` for UI/body) — it's already doing its job well and a redesign doesn't need to touch a working type system.

**Addition — Kinetic Typography Rule:** Hero headlines and section titles now animate in as part of the motion system (see §4.3), not just fade in as a block. Treat every `h1`/`h2` as composed of words or characters that can be staged individually.

---

## 4. Animation & Motion System v2.0 — "Cinematic & Bold"

This is the primary upgrade in this revision. The goal: scrolling the site should feel like watching a well-edited reel, not browsing a webpage.

### 4.1 Recommended Tooling
- **Framer Motion** — component-level enter/exit animations, shared layout transitions between portfolio grid → album detail (`layoutId` for the clicked photo growing into the lightbox/hero).
- **GSAP + ScrollTrigger** — scroll-scrubbed effects: parallax layers, pinned sections, scroll-driven reveals, and the horizontal category-portal scroll on Home.
- Use Framer Motion for React component choreography and GSAP specifically for anything that needs to be *scrubbed by scroll position* — they compose fine in the same app; don't fight over which owns a given element.

### 4.2 Global Motion Principles
- **Signature easing:** Replace the flat `cubic-bezier(0.16, 1, 0.3, 1)` used everywhere in v1.0 with a small *system* of curves so different motion types feel distinct:
  - `--ease-reveal: cubic-bezier(0.22, 1, 0.36, 1)` — content entering the viewport (slow-out, decisive).
  - `--ease-hover: cubic-bezier(0.34, 1.56, 0.64, 1)` — buttons/cards on hover (slight overshoot, alive but not cartoonish).
  - `--ease-page: cubic-bezier(0.65, 0, 0.35, 1)` — route transitions (symmetric, cinematic cut).
- **Respect motion preferences:** Every animation wrapped in a `prefers-reduced-motion` check — fall back to opacity-only fades, no parallax/scale, no autoplay reels.
- **Stagger, don't synchronize:** Grids of cards, bullet lists, and nav items reveal with an 60–90ms stagger between siblings, never all at once.

### 4.3 Signature Effects (Apply Site-Wide)

**1. Text Reveal on Scroll**
Headlines split into words (or lines for longer copy). Each word animates from `opacity: 0, y: 24px, filter: blur(6px)` to fully resolved, staggered ~40ms per word, triggered when the element crosses 75% viewport height. Applies to every `h1`/`h2` and pull-quote on the public site.

**2. Parallax Depth Layers**
Hero sections and category-portal images move at a different scroll speed than their surrounding text/UI (background image at 0.8x scroll speed, foreground text at 1x, floating badges/pills at 1.15x). Creates a 3-layer depth illusion without 3D libraries. Apply to: Home hero, Album Detail hero banner, About page atmospheric background.

**3. Scroll-Scrubbed Storytelling (Home Page "The Craft" section)**
Instead of the four pillars fading in as a static grid, pin the section (`ScrollTrigger.pin`) and scrub through the four pillars as the user scrolls — one pillar fully visible/active at a time, icon animating in, previous pillar dissolving back. Un-pins once all four have played.

**4. Magnetic Buttons**
Primary CTAs (`Explore Portfolio`, `Book a Shoot`, `Inquire For Dates`) subtly follow the cursor within a small radius (~12px max offset) when hovered, using a spring-based transform. Releases back to center on mouse leave. Signals interactivity and adds a tactile, premium feel without being gimmicky.

**5. Shared-Element Transitions (Portfolio → Album Detail)**
When a user clicks an album card in `/portfolio`, the clicked cover photo should visually morph/grow into the hero image of `/portfolio/album/:slug` (Framer Motion `layoutId` shared between the card image and the detail hero image) rather than a hard route cut. This is the single highest-impact motion upgrade for this site given how central the photo-to-story journey is.

**6. Cinematic Route Transitions**
On every route change: outgoing page fades + scales down slightly (`scale: 0.98, opacity: 0`), a brief obsidian-to-gold film-wipe overlay crosses the viewport, incoming page scales up from `0.98 → 1` while fading in. Duration ~450ms total, using `--ease-page`.

**7. Image Reveal Mask**
Instead of images simply fading in, reveal them with a vertical "curtain" wipe (`clip-path: inset(100% 0 0 0)` → `inset(0 0 0 0)`) synced with the text-reveal timing above. Used on: album cover photos entering viewport, team portraits, testimonial avatars.

**8. Ambient Idle Motion**
Small looping details that make the page feel alive even when the user isn't scrolling: the scroll-indicator line on the Home hero gently pulses; gold glow behind the hero title breathes at ~6s cycle (`opacity 0.5 → 0.8 → 0.5`); Instagram strip images have a very slow, near-imperceptible Ken Burns zoom (`scale 1 → 1.03 over 20s`) while idle.

**9. Custom Cursor (Optional, Desktop Only)**
On hoverable media (portfolio cards, video reels), replace the default cursor with a small circular gold-outlined cursor that shows contextual text (`View`, `Play`, `4/18`). Disabled on touch devices automatically.

### 4.4 Page-by-Page Motion Notes
| Page | Signature Motion |
|---|---|
| Home | Parallax hero, pinned "Craft" scrub-through, magnetic CTAs, staggered category-portal grid entrance |
| Portfolio | Filter pill switch animates active-pill background with a shared layout transition (slides, doesn't teleport); grid re-filters with stagger + fade, not a hard re-render |
| Album Detail | Shared-element hero transition from Portfolio; masonry tiles reveal with image-mask wipe as they scroll into view |
| Services | Package cards tilt very slightly toward cursor (max 4°) on hover — subtle 3D card effect using CSS `perspective` |
| About | Slow parallax on atmospheric background; crest badge has breathing backlight glow |
| Team | Portrait cards reveal with mask wipe; hover lifts card and cross-fades bio/gear tags in |
| Contact | Form fields animate focus ring with a gold glow expansion; success state plays a checkmark draw-in animation (SVG path animation, not just a static icon swap) |
| Admin suite | **No cinematic motion.** Fast, functional transitions only (150–200ms fades). This is a productivity tool — motion here should never slow down a working admin. |

### 4.5 Performance Guardrails
- Animate only `transform` and `opacity` where possible — avoid animating `width`, `top/left`, or `box-shadow` on scroll (causes layout thrashing on lower-end devices).
- Parallax and scroll-scrub effects should be disabled or reduced to simple fades below a defined breakpoint (e.g., under 768px) — motion-heavy scroll-jacking is often worse on mobile than no motion at all.
- Lazy-mount GSAP ScrollTrigger instances only for sections currently near the viewport; don't register scroll listeners for the entire page on mount.

---

## 5. Micro-Interaction Token Reference

```css
:root {
  --ease-reveal: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-hover: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-page: cubic-bezier(0.65, 0, 0.35, 1);

  --duration-fast: 150ms;
  --duration-base: 350ms;
  --duration-reveal: 600ms;
  --duration-page: 450ms;
}
```

Buttons: hover state now uses `--ease-hover` with `-2px` translate (kept from v1.0) plus the new `--brand-amber-glow` shadow and the magnetic-follow behavior from §4.3.4.

---

## 6. Implementation Priority (Suggested Order)

1. Swap color tokens (§2.1) site-wide — lowest risk, immediate visual refresh.
2. Add global easing/duration tokens (§5) and apply to existing hover states.
3. Implement text-reveal-on-scroll and image-mask-reveal (§4.3.1, §4.3.7) — highest visual impact per effort, works on every page with no new dependencies beyond Framer Motion.
4. Add shared-element transition for Portfolio → Album Detail (§4.3.5) — the signature "wow" moment.
5. Add parallax layers and pinned scroll-scrub section on Home (§4.3.2, §4.3.3) — requires GSAP ScrollTrigger setup.
6. Layer in magnetic buttons, custom cursor, and ambient idle motion (§4.3.4, §4.3.8, §4.3.9) as polish passes.
7. Explicitly exclude admin suite from steps 3–6 per §4.4.

---

## 7. What NOT to Change

To keep this a focused redesign rather than a rebuild:
- Do not alter routing, data-fetching, or state management logic from `frontend.md` v1.0.
- Do not change the three-font typography system.
- Do not change the underlying grid/breakpoint structure (§9 of v1.0) — only what animates within it.
- Do not touch the admin suite's information architecture — only its color tokens inherit from §2, not its motion.
