# Focus Signage

Official marketing website for **Focus Signage** — a branding, printing, and 3D & 2D signage company based in Dar es Salaam, Tanzania.

## Features

- **Single-page responsive layout** covering Hero, About (CEO message, mission, vision, values, industries), Services, Competitive Advantages, 5-step Operational Process, Portfolio gallery, and Contact.
- **Dark & Light theme toggle** with user preference saved in `localStorage`.
- **Interactive UI & motion effects** (respecting `prefers-reduced-motion`):
  - Interactive HTML5 `<canvas>` particle background with mouse repulsion
  - Hero typing animation, word-by-word reveal, and parallax orbits
  - 3D magnetic tilt cards and staggered scroll-reveal animations
  - Animated stat counters and top scroll progress indicator
  - Custom cursor and full-screen portfolio image lightbox
- **SEO ready** with Open Graph tags, Twitter Card metadata, `robots.txt`, and `sitemap.xml`.
- **Direct quote & contact links** via WhatsApp, Email, and Instagram.

## Tech Stack

- **HTML5** — Semantic markup (`index.html`)
- **CSS3** — Custom properties, dark/light theming, glassmorphism, responsive layouts (`style.css`)
- **Vanilla JavaScript** — Zero framework or build dependencies (`script.js`)
- **Fonts** — Google Fonts (`Syne`, `Space Grotesk`, `JetBrains Mono`)

## Project Structure

```text
.
├── index.html       # Main single-page site
├── style.css        # Theme tokens, layout, and component styles
├── script.js        # Animations, lightbox, theme toggle, particles
├── logo.svg         # Vector brand mark
├── robots.txt       # Search engine crawl rules
├── sitemap.xml      # XML sitemap
└── uploads/         # Brand logos, portfolio photos, and company assets
```

## Running Locally

Because this is a static site with no build step, you can preview it directly:

1. Clone the repository:
   ```bash
   git clone https://github.com/holysinner22/focus-signage.git
   cd focus-signage
   ```
2. Open `index.html` in your browser, or serve the folder locally:
   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node.js
   npx serve .
   ```

## Deployment

Deploy directly to any static hosting provider (GitHub Pages, Netlify, Vercel, Cloudflare Pages, or traditional web hosting) by publishing the repository root.

If deploying under a different domain, update the canonical URL and sitemap domain in `index.html`, `robots.txt`, and `sitemap.xml`.

## Contact

- **Location:** Kinondoni, Dar es Salaam, Tanzania
- **WhatsApp:** [+255 654 508 394](https://wa.me/255654508394)
- **Email:** [bwireemanuel8@gmail.com](mailto:bwireemanuel8@gmail.com)
- **Instagram:** [@focus_signage](https://instagram.com/focus_signage)
