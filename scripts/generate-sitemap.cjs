const fs = require('fs');
const path = require('path');
require('dotenv').config();

const siteUrl = process.env.VITE_SITE_URL && !process.env.VITE_SITE_URL.includes("vercel.app") ? process.env.VITE_SITE_URL : "https://viscawebstudio.com";
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/client-questionnaire</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/privacy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.2</priority>
  </url>
  <url>
    <loc>${siteUrl}/terms</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.2</priority>
  </url>
</urlset>`;

const robotsContent = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;

fs.writeFileSync(sitemapPath, sitemapContent);
fs.writeFileSync(robotsPath, robotsContent);
console.log('Sitemap and robots.txt generated successfully with siteUrl: ' + siteUrl);
