import type { APIRoute } from 'astro';

const baseUrl = 'https://agecalculatorpro.app';

const pages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/guides', changefreq: 'weekly', priority: '0.9' },
  { path: '/guides/how-age-is-calculated', changefreq: 'monthly', priority: '0.8' },
  { path: '/guides/chronological-vs-biological-age', changefreq: 'monthly', priority: '0.8' },
  { path: '/guides/leap-years-and-age-calculation', changefreq: 'monthly', priority: '0.8' },
  { path: '/guides/zodiac-signs-by-date-of-birth', changefreq: 'monthly', priority: '0.8' },
  { path: '/guides/age-calculation-for-official-documents', changefreq: 'monthly', priority: '0.8' },
  { path: '/guides/days-between-dates', changefreq: 'monthly', priority: '0.8' },
  { path: '/about-us', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact-us', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.5' },
  { path: '/cookie-policy', changefreq: 'yearly', priority: '0.5' },
  { path: '/terms-of-service', changefreq: 'yearly', priority: '0.5' },
  { path: '/disclaimer', changefreq: 'yearly', priority: '0.5' },
] as const;

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString();

  const urls = pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
