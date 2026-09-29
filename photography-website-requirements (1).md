# Skypixel — Photography & Videography Studio Website

## Project Requirements Document (PRD)

**Version:** 1.1 **Date:** September 10, 2026 **Prepared for:** Skypixel — Photography/Videography studio (weddings, hotels, birthday parties, corporate & other events)

---

## 1\. Project Overview

A public-facing portfolio website for a photography & videography studio that covers weddings, hotel/hospitality shoots, birthday parties, and other events. The site's primary job is to **showcase the studio's best work beautifully** and **convert visitors into inquiries/bookings** (via a contact/inquiry form — not an online payment system in this phase).

The studio has a team (multiple photographers/videographers), so the site should reflect that it's a full creative team, not a solo freelancer.

**Core purpose (confirmed):** Public portfolio only — showcase work, generate leads. No client login or private galleries in this phase (see Section 15 for future roadmap).

**Admin needs (confirmed):** A simple, single-admin dashboard to upload and organize photos/videos into albums — no multi-role permission system needed for now.

---

## 2\. Objectives

- Make an emotionally engaging first impression — visitors should feel the quality of the work within seconds of landing.  
- Organize work clearly by **event type** (Weddings, Hotels/Hospitality, Birthday Parties, Corporate, Other) so visitors self-select quickly.  
- Support **both photos and videos** natively and beautifully (not as an afterthought).  
- Make it trivially easy for the studio to add new work after every shoot via a simple admin panel — no code changes needed.  
- Generate qualified leads through a clear inquiry/contact flow.  
- Load fast despite being media-heavy, by leaning on Cloudinary for optimized delivery.

---

## 3\. Scope

### In scope (Phase 1\)

- Public marketing/portfolio site (home, portfolio/gallery, about/team, services, contact)  
- Category-based photo & video galleries with lightbox/video playback  
- Single-admin panel for uploading media, creating albums, tagging by category  
- Contact/inquiry form with email notification  
- Cloudinary-backed media storage and delivery  
- MongoDB Atlas–backed content (albums, media metadata, team, testimonials, inquiries)  
- Fully responsive, mobile-first design  
- Basic SEO setup

### Out of scope (Phase 1\) — see Section 15 for roadmap

- Client login / private galleries for couples or event hosts  
- Online booking calendar or payment processing  
- Multi-admin roles & permissions  
- E-commerce (print/download sales)

---

## 4\. Tech Stack

| Layer | Technology | Notes |
| :---- | :---- | :---- |
| Language | TypeScript | Used across frontend and backend for type safety |
| Frontend | React (+ Vite) | Confirmed preference |
| Backend | Node.js \+ Express (TypeScript) | REST API |
| Database | MongoDB Atlas | Cloud-hosted, stores metadata only (not binary media) |
| Media storage/CDN | Cloudinary | Stores & serves all photos and videos, handles transformations |
| Auth (admin only) | JWT \+ bcrypt | Single admin account, no public user accounts |
| Email (inquiry notifications) | Nodemailer / Resend / SendGrid (pick one) | Sends inquiry form submissions to studio's inbox |
| Hosting (suggested) | Vercel/Netlify (frontend) \+ Render/Railway (backend), or a single VPS | Final choice depends on budget |
| Image/video upload UX | Cloudinary Upload Widget or direct signed uploads from admin panel | Avoids routing large files through your own server |

---

## 5\. Information Architecture / Sitemap

/                         Home

/portfolio                All work, filterable by category

/portfolio/weddings       Wedding-specific gallery

/portfolio/hotels         Hotel/hospitality gallery

/portfolio/birthdays      Birthday party gallery

/portfolio/corporate      Corporate/other events gallery

/portfolio/album/:slug    Single album detail (photos \+ videos from one shoot)

/about                    Studio story

/team                     Meet the team (photographers/videographers)

/services                 What's offered (photo, video, packages — descriptive, not e-commerce)

/testimonials             Client reviews (optional, can live on Home too)

/contact                  Inquiry form \+ studio contact info

/admin/login              Admin login

/admin/dashboard          Overview (recent uploads, inquiry count)

/admin/albums             Manage albums (create/edit/delete)

/admin/albums/:id/media   Upload & manage photos/videos in an album

/admin/inquiries          View contact form submissions

/admin/team               Manage team member profiles

---

## 6\. Functional Requirements

### 6.1 Public-facing site

**Home page**

- Full-bleed hero (image or auto-playing muted video reel of best work)  
- Featured/curated highlight albums (rotating, pulled from "featured" flag in admin)  
- Short studio intro \+ call to action ("View our work" / "Get in touch")  
- Category tiles (Weddings / Hotels / Birthdays / Corporate / Other) linking into filtered portfolio  
- Testimonial snippet strip  
- Instagram/social feed strip (optional, static curated images to start — avoids extra API dependency)

**Portfolio / Gallery**

- Masonry or grid layout, category filter (client-side or query-param driven)  
- Mixed media support: photo thumbnails and video thumbnails (with play icon overlay) in the same grid  
- Clicking a photo opens a lightbox (swipe/arrow navigation between items in that album)  
- Clicking a video opens an inline player (Cloudinary video player or HTML5 `<video>` with Cloudinary-optimized source)  
- Lazy-loading / infinite scroll or pagination for performance  
- Each album has a short caption (event type, optionally venue name, month/year — no exact client names needed unless studio wants that for social proof)

**Album detail page**

- Cover image, album title, short story/description  
- Full grid of that album's photos \+ videos  
- "Enquire about a similar shoot" CTA at the bottom

**About / Team**

- Studio story and philosophy  
- Team grid: photo, name, role (e.g., Lead Photographer, Videographer, Editor), 1–2 line bio  
- Equipment/style blurb (optional — many photography sites include this for credibility)

**Services**

- Cards per event type (Wedding, Hotel/Hospitality, Birthday, Corporate, Other) describing what's offered — full-day coverage, cinematic video, drone, same-day edits, etc. (descriptive only, no cart/checkout)

**Contact / Inquiry**

- Form fields: Name, Email, Phone, Event type (dropdown), Event date, Venue/location, Message  
- On submit: saved to MongoDB **and** emailed to studio owner  
- Success/confirmation state on the page  
- Studio's direct contact info (phone, email, Instagram/WhatsApp link) also shown alongside the form

**Global**

- Sticky/responsive navigation, mobile hamburger menu  
- Footer with contact info, social links, quick links to categories  
- Smooth page transitions/scroll animations (tasteful, not excessive — see Section 11\)

### 6.2 Admin Panel (single admin)

- **Login:** email \+ password, JWT stored in httpOnly cookie, session expiry  
- **Dashboard:** quick stats — total albums, total media count, new inquiries this week  
- **Album management:**  
  - Create album: title, category (Wedding/Hotel/Birthday/Corporate/Other), date, description, cover image, "featured" toggle  
  - Edit/delete album  
  - Reorder albums (drag-and-drop or simple order field) within a category  
- **Media management (per album):**  
  - Upload multiple photos/videos at once (Cloudinary widget or signed direct upload)  
  - Auto-generate thumbnails/previews for videos via Cloudinary  
  - Set a photo as the album cover  
  - Delete individual media items  
  - Reorder media within an album  
- **Team management:** add/edit/remove team member (name, role, photo, bio, display order)  
- **Inquiries:** list of contact form submissions, mark as read/responded, basic search/filter by date or event type  
- **Testimonials (optional):** add/edit/delete client testimonials to feature on the site

---

## 7\. Data Models (MongoDB Atlas)

> Media **files** live in Cloudinary. MongoDB stores only metadata \+ Cloudinary URLs/public IDs, keeping the DB lightweight.

### `Admin`

| Field | Type | Notes |
| :---- | :---- | :---- |
| \_id | ObjectId |  |
| email | string | unique |
| passwordHash | string | bcrypt |
| createdAt | Date |  |

### `Album`

| Field | Type | Notes |
| :---- | :---- | :---- |
| \_id | ObjectId |  |
| title | string | e.g. "Rohan & Ayesha's Wedding" |
| slug | string | URL-friendly, unique |
| category | enum | `wedding` | `hotel` | `birthday` | `corporate` | `other` |
| description | string | optional |
| eventDate | Date | optional |
| location | string | optional |
| coverMediaId | ObjectId | ref → Media |
| featured | boolean | shown on Home |
| order | number | manual sort order |
| createdAt / updatedAt | Date |  |

### `Media`

| Field | Type | Notes |
| :---- | :---- | :---- |
| \_id | ObjectId |  |
| albumId | ObjectId | ref → Album |
| type | enum | `image` | `video` |
| cloudinaryPublicId | string | for transformations/deletion |
| url | string | Cloudinary secure URL |
| thumbnailUrl | string | especially for videos |
| width / height | number |  |
| duration | number | video only, seconds |
| order | number | sort order within album |
| createdAt | Date |  |

### `TeamMember`

| Field | Type | Notes |
| :---- | :---- | :---- |
| \_id | ObjectId |  |
| name | string |  |
| role | string | e.g. "Lead Photographer" |
| bio | string | short |
| photoUrl | string | Cloudinary |
| order | number |  |

### `Inquiry`

| Field | Type | Notes |
| :---- | :---- | :---- |
| \_id | ObjectId |  |
| name | string |  |
| email | string |  |
| phone | string |  |
| eventType | enum | matches Album categories |
| eventDate | Date | optional |
| venue | string | optional |
| message | string |  |
| status | enum | `new` | `responded` | `archived` |
| createdAt | Date |  |

### `Testimonial` (optional)

| Field | Type | Notes |
| :---- | :---- | :---- |
| \_id | ObjectId |  |
| clientName | string |  |
| eventType | string |  |
| quote | string |  |
| rating | number | 1–5, optional |
| order | number |  |

---

## 8\. Cloudinary Integration

- **Folder structure in Cloudinary**, mirroring albums for sanity: `studio/{category}/{album-slug}/{filename}`  
- **Uploads:** use signed uploads (backend generates a short-lived signature) or the Cloudinary Upload Widget directly from the admin panel — avoids proxying large video files through your Node server.  
- **Images:** request responsive/auto-format, auto-quality transformations (`f_auto,q_auto`) so browsers get the smallest suitable format (WebP/AVIF where supported).  
- **Videos:** use Cloudinary's video transformations to auto-generate a poster/thumbnail frame and serve adaptive-bitrate/optimized video (`q_auto`, `f_auto` for video too).  
- **Deletion:** when an admin deletes a Media doc, also call Cloudinary's destroy API using the stored `cloudinaryPublicId` to avoid orphaned files.  
- Store the **Cloudinary public ID**, not just the URL, so you can always regenerate transformed URLs or delete cleanly later.

---

## 9\. API Design (REST, illustrative)

| Method | Endpoint | Auth | Purpose |
| :---- | :---- | :---- | :---- |
| GET | `/api/albums?category=` | Public | List albums, optional category filter |
| GET | `/api/albums/:slug` | Public | Album detail \+ its media |
| GET | `/api/team` | Public | Team members |
| GET | `/api/testimonials` | Public | Testimonials |
| POST | `/api/inquiries` | Public | Submit contact form |
| POST | `/api/admin/login` | Public | Admin auth, returns JWT |
| POST | `/api/admin/albums` | Admin | Create album |
| PUT | `/api/admin/albums/:id` | Admin | Update album |
| DELETE | `/api/admin/albums/:id` | Admin | Delete album (+ its media from Cloudinary) |
| POST | `/api/admin/albums/:id/media` | Admin | Add media (after Cloudinary upload, save metadata) |
| DELETE | `/api/admin/media/:id` | Admin | Delete a media item |
| GET | `/api/admin/inquiries` | Admin | List inquiries |
| PATCH | `/api/admin/inquiries/:id` | Admin | Update inquiry status |
| POST/PUT/DELETE | `/api/admin/team/...` | Admin | Manage team members |

---

## 10\. Authentication & Security

- Single admin account, seeded manually (no public sign-up).  
- Passwords hashed with bcrypt; never stored in plain text.  
- JWT issued on login, stored as httpOnly \+ Secure cookie (not localStorage, to reduce XSS token theft risk).  
- All `/api/admin/*` routes protected by auth middleware verifying the JWT.  
- Rate-limit the login endpoint and the public inquiry form endpoint (to prevent spam/brute force).  
- Validate & sanitize all form inputs server-side (contact form especially — public-facing).  
- Cloudinary upload signatures generated server-side and short-lived, never expose Cloudinary API secret to the frontend.  
- CORS restricted to your own frontend domain in production.

---

## 11\. Form Validation (Client \+ Server)

Every form in the app is validated **twice** — once in the browser for instant feedback, and again on the server, since client-side checks can always be bypassed. Both sides should share the same validation rules where possible so they never drift out of sync.

### 11.1 Public contact/inquiry form

| Field | Client-side check | Server-side check |
| :---- | :---- | :---- |
| Name | required, 2–60 chars | same, plus trim/sanitize |
| Email | required, valid email format | same \+ format re-check (never trust the client) |
| Phone | required, valid phone pattern (allow country codes) | same |
| Event type | required, must be one of the fixed category list | must match an allowed enum value |
| Event date | optional, must be a valid future-or-any date | same, reject malformed dates |
| Venue | optional, max length cap | same |
| Message | required, min/max length (e.g. 10–1000 chars) | same, strip HTML/script tags before saving |

- Inline field errors shown as the user types/blurs (not just on submit).  
- Submit button disabled while the request is in flight, to avoid duplicate submissions.  
- Server additionally: rate-limits this endpoint (see Section 10\) and rejects submissions that fail validation with a clear 400 response the frontend can map back to field errors.

### 11.2 Admin panel forms

| Form | Client-side check | Server-side check |
| :---- | :---- | :---- |
| Login | required email \+ password fields | credential check \+ generic "invalid email or password" error (never reveal which field was wrong) |
| Create/edit album | required title, valid category enum, slug auto-generated & checked for uniqueness before submit | re-validate category enum, enforce slug uniqueness at the DB level (unique index) |
| Team member | required name/role, bio max length, image required | same, plus confirm the image URL is a genuine Cloudinary asset before saving |
| Media upload | restrict file picker to accepted types (`image/*`, `video/*`), enforce a max file size client-side before upload starts | Cloudinary itself enforces the real size/type limits on upload; backend re-checks the returned resource type/format before writing the `Media` document, and rejects/deletes anything unexpected |

### 11.3 Shared approach

- Use a schema-validation library so client and server can reuse (or closely mirror) the same rules instead of duplicating logic by hand — e.g. **Zod** works well in a TypeScript stack and can validate both the React form state and the Express request body from a single schema definition.  
- Server-side validation is the actual security boundary; client-side validation is strictly a UX nicety for faster feedback and should never be relied on for data integrity or safety.  
- All error responses from the API return a consistent shape (field name \+ message) so the frontend can highlight the exact input that failed.

---

## 12\. Design & UX Guidelines

Since this is explicitly meant to look **aesthetic and pleasing**, some concrete direction:

- **Let the photography lead.** Large, high-resolution imagery with generous white space; UI chrome (buttons, nav, text) should stay quiet and out of the way.  
- **Typography:** pair one elegant serif or editorial display font (for headings — evokes a premium, timeless feel common in wedding/event photography) with a clean, neutral sans-serif for body text.  
- **Color palette:** mostly neutral (off-white/cream, charcoal, soft black) so photos provide the color; pull **one accent color from the existing Skypixel logo** (rather than inventing a new one) and use it sparingly for CTAs and highlights, so the site feels consistent with the studio's existing brand.  
- **Motion:** subtle fade/scale-in on scroll, smooth hover states on gallery tiles, gentle image crossfades — avoid flashy or distracting animation that competes with the photos.  
- **Grid:** masonry-style galleries (Pinterest-like) read as more editorial than rigid uniform grids; mix full-width "hero" images between grid sections to add rhythm.  
- **Video handling:** auto-play muted looping teaser clips (like Instagram Reels previews) in grid tiles are very effective for a videography-inclusive portfolio — tap/click to unmute and go full player.  
- **Mobile-first:** most wedding-site traffic is from phones — ensure galleries and lightboxes are thumb-friendly with swipe gestures.  
- **Consistency:** consistent aspect ratios and consistent spacing rhythm across categories makes a huge difference in perceived polish.

---

## 13\. Non-Functional Requirements

- **Performance:** target Largest Contentful Paint \< 2.5s on 4G; achieved primarily via Cloudinary's auto-format/quality delivery \+ lazy loading.  
- **Responsiveness:** fully responsive from \~360px mobile to large desktop.  
- **SEO:** proper meta tags, Open Graph tags (important — people share wedding albums on social), sitemap.xml, semantic HTML, alt text on images (can be auto-filled from album/category, editable in admin).  
- **Accessibility:** sufficient color contrast, keyboard-navigable lightbox, alt text, focus states.  
- **Reliability:** basic error handling and logging on the backend; graceful "no results" states on empty categories.  
- **Scalability:** Cloudinary and MongoDB Atlas both scale independently of the app server, so this isn't a major initial concern.

---

## 14\. Suggested Project Structure

/client                     React \+ TypeScript frontend

  /src

    /components

    /pages

    /admin

    /hooks

    /api            (fetch wrappers)

    /types

/server                      Node.js \+ Express \+ TypeScript backend

  /src

    /models         (Mongoose schemas: Album, Media, TeamMember, Inquiry, Admin, Testimonial)

    /routes

    /controllers

    /middleware     (auth, error handling, rate limiting)

    /services       (cloudinary.ts, email.ts)

    /config         (db.ts, env.ts)

    server.ts

/.env                         CLOUDINARY\_\*, MONGODB\_URI, JWT\_SECRET, EMAIL\_\*

---

## 15\. Deployment & Hosting Considerations

- **Frontend:** Vercel or Netlify (fast, free tier friendly for a React app).  
- **Backend:** Render, Railway, or a small VPS (DigitalOcean/AWS Lightsail) running the Node/Express API.  
- **Database:** MongoDB Atlas free/shared tier is sufficient at this scale (metadata only, not media files).  
- **Media:** Cloudinary free/starter tier is usually enough to start; monitor bandwidth as the portfolio grows and upgrade if needed.  
- **Domain & SSL:** custom domain with HTTPS (most hosts above provide free SSL via Let's Encrypt automatically).  
- **Environment variables:** keep all Cloudinary, MongoDB, and JWT secrets out of source control (`.env`, not committed).

---

## 16\. Future Enhancements (Phase 2 — not in current scope)

Worth designing the data model with these in mind, even though they're out of scope now:

- Private client galleries with login (couples/event hosts view & download their own photos)  
- Online booking calendar / date-availability checker  
- Payment integration for booking deposits or print/digital download purchases  
- Multi-admin roles (so team members can upload without full admin access)  
- Client-facing "select your favorites" tool for post-shoot photo selection  
- Automated Instagram feed integration  
- Blog/journal section for SEO (real wedding features, behind-the-scenes)

---

## 17\. Confirmed Details

| Question | Answer | Implication |
| :---- | :---- | :---- |
| Brand name & logo | **Skypixel** — existing logo available | Use the provided logo in the nav/footer; pull an accent color from it for the palette in Section 12 rather than inventing one from scratch |
| Client names on albums | **Anonymous for now** (e.g., "A Garden Wedding, June 2026"), may revisit later | `Album.title`/`description` fields (Section 7\) stay free-text so this is a content decision, not a schema change — no client-name field needed at launch |
| Inquiry notification email | Studio has an existing email address | Point Nodemailer/SendGrid/Resend (Section 4\) at that inbox — no new email service needs to be created, just SMTP/API credentials for the existing address |
| Instagram | Studio has an active Instagram page | Add the handle as a footer/header link, and use it to seed the optional "social feed strip" on Home (Section 6.1) — can start as a manually curated set of images rather than a live API integration |
| Existing content | **\~10 albums** to migrate at launch | Small enough to enter manually through the admin panel once built — no bulk-import script needed for Phase 1 |

