# Haviy Global Services website

Static marketing website for Haviy Global Services (HGS), a Nairobi based travel,
transport and concierge services provider. Content, imagery and brand colours all
come from the official HGS company profile.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home. Hero with quick enquiry bar, company overview, service index, destinations, fleet, why HGS, process, FAQ. |
| `about.html` | Overview, vision and mission, core values, core objectives, why HGS. |
| `services.html` | Full detail for all nine service lines with a sticky jump rail. |
| `contact.html` | Contact details and enquiry form, coverage areas. |

## Design system

Everything is driven by tokens in the `:root` block at the top of
`assets/css/styles.css`.

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#061a2b` | Deep navy ground for dark chapters, footer, hero |
| `--blue` | `#1e73a7` | Brand blue, sampled from the company profile |
| `--sky` | `#6ab8e8` | Lifted blue for accents on dark grounds |
| `--ember` | `#ef6e32` | Brand orange, the single loud accent |
| `--mist` | `#edf2f6` | Cool neutral ground, biased toward the blue |
| `--paper` | `#ffffff` | Light ground |

Typography is Bricolage Grotesque for display and Instrument Sans for body and
labels, loaded from Google Fonts with system fallbacks. The site commits to one
brand look rather than following the visitor's light or dark preference, so every
colour is painted explicitly.

The page alternates light and ink chapters. Services are presented as a numbered
index with a cursor following image preview on desktop and thumbnails on mobile.
Fleet is a horizontal rail. There are no repeating three up card grids.

## Imagery

The source company profile is a set of flattened page images, so every photograph
was cropped out of the rendered PDF pages, trimmed of its background, and put
through one shared colour grade so the set reads as art directed rather than as a
collage. The grade lifts shadows toward navy, warms the highlights slightly and
pulls back saturation.

`assets/img/hero.jpg` is the wide desktop hero. `assets/img/hero-portrait.jpg` is
a separate portrait frame used on phones, where the wide image would crop to an
unreadable slice.

## Structure

```
index.html, about.html, services.html, contact.html
assets/
  css/styles.css    tokens, then components
  js/main.js        navigation, reveal, counters, cursor preview, forms
  img/              graded photography and logos from the company profile
```

No build step and no dependencies. Open a page directly, or serve the folder:

```bash
python3 -m http.server 8000
```

## Deployment

Plain HTML, CSS and JavaScript, so it hosts anywhere static files are served:
GitHub Pages, Netlify, Vercel, Cloudflare Pages or standard shared hosting.
Upload the repository contents to the web root and point `hgs.co.ke` at it.

## Enquiry form

The hero quick bar passes `service`, `date` and `pax` to `contact.html` as query
parameters and the contact form prefills from them. On submit the form composes a
structured email and opens the visitor's mail client, so it works with no backend.

To capture submissions server side instead, point the form at a service such as
Formspree or Netlify Forms and remove the submit handler in `assets/js/main.js`.

## Content that still needs the business

Three things are missing because the company profile does not contain them, and
each one is worth more to conversion than further design work:

* Named corporate clients or partner logos
* Client testimonials with attribution
* Indicative pricing, or at least starting rates per service

The destination list on the home page is drawn from Kenya's major wildlife
destinations and should be confirmed against what HGS actually arranges before
launch.
