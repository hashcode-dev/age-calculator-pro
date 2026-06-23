import type { APIRoute } from 'astro';

const baseUrl = 'https://agecalculatorpro.app';

const pages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about-us', changefreq: 'monthly', priority: '0.8' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.5' },
  { path: '/terms-of-service', changefreq: 'yearly', priority: '0.5' },
  { path: '/contact-us', changefreq: 'monthly', priority: '0.7' },
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
