# Age Calculator Pro

Production-ready Astro micro SaaS for precise age calculations, age difference analysis, life statistics, and export/share workflows.

## Tech Stack

- Astro 7 (compatible with Astro 5+ architecture)
- TypeScript
- React Islands (`@astrojs/react`)
- CSS Modules + global design tokens
- `date-fns` for date math
- `html2canvas` + `jspdf` for exports

## Features

- Exact age calculator (years, months, weeks, days, hours, minutes)
- Age difference calculator (years, months, days)
- Additional life metrics (next birthday, weekday, zodiac, heartbeats, sleep)
- Share result to clipboard
- Export result as PDF and PNG
- Theme system: Light / Dark / System, persisted in `localStorage`
- SEO setup: meta, Open Graph, Twitter cards, canonical, JSON-LD schemas

## Project Structure

```text
src/
├── assets/
├── components/
├── content/
├── layouts/
├── pages/
├── styles/
└── utils/
```

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deployment Guide

### Vercel

1. Import the repository in Vercel.
2. Framework preset: `Astro`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Deploy.

### Netlify

1. Create a new site from your repository.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Deploy site.

### Cloudflare Pages

1. Create a new Pages project connected to your repository.
2. Build command: `npm run build`.
3. Build output directory: `dist`.
4. Deploy.

## Lighthouse Notes

- Keep image assets compressed and avoid oversized bitmap backgrounds.
- Preserve semantic heading order and accessible labels.
- Keep third-party scripts minimal.
- Validate schema markup with Rich Results Test before production.
