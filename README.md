# Haviy Global Services website

A static marketing website for Haviy Global Services (HGS), a Nairobi based travel,
transport and concierge services provider. All content, imagery and brand colours are
taken from the official HGS company profile.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home. Hero, company overview, vision and mission, all nine services, why choose us, core values. |
| `about.html` | Company overview, vision and mission, core values, core objectives, why choose us. |
| `services.html` | Full detail for every service line, with a sticky jump navigation. |
| `contact.html` | Contact details, enquiry form, coverage areas. |

## Brand

| Token | Value | Use |
| --- | --- | --- |
| Blue | `#1e73a7` | Primary brand colour, links, accents |
| Deep blue | `#16508d` | Gradients, headings on light panels |
| Navy | `#0e3455` / `#0a2740` | Dark sections, footer, hero overlay |
| Orange | `#ef6e32` | Calls to action and highlights |

Typography is Plus Jakarta Sans for headings and Inter for body text, loaded from
Google Fonts with system fallbacks.

## Structure

```
index.html, about.html, services.html, contact.html
assets/
  css/styles.css     all styling, design tokens at the top of the file
  js/main.js         navigation, scroll reveal, counters, enquiry form
  img/               photography and logos extracted from the company profile
```

There is no build step and no dependencies. Open any page directly in a browser,
or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Deployment

The site is plain HTML, CSS and JavaScript, so it can be hosted anywhere static
files are served: GitHub Pages, Netlify, Vercel, Cloudflare Pages or standard
shared hosting. Upload the repository contents to the web root and point
`hgs.co.ke` at it.

## Editing content

* Service copy lives directly in `services.html` and in the service cards on `index.html`.
* Contact details appear in the footer of every page, in `contact.html` and in the
  WhatsApp link at the bottom right of each page.
* Colours, spacing and typography are controlled by the custom properties in the
  `:root` block at the top of `assets/css/styles.css`.

## Enquiry form

The form on `contact.html` composes a structured email and opens the visitor's mail
client, so it works without a backend. To capture submissions server side instead,
point the form at a service such as Formspree or Netlify Forms and remove the
`submit` handler in `assets/js/main.js`.
