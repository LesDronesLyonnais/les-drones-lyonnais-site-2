// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// The public site stays static (prerendered at build). Only the account area
// (/connexion/, /compte/, /admin/) runs on demand in the Cloudflare Worker, with D1
// (accounts, orders, missions) and R2 (invoices, deliverables): see wrangler.jsonc.
export default defineConfig({
  site: 'https://www.lesdroneslyonnais.com',
  // The WordPress site serves every URL with a trailing slash; keep them identical.
  trailingSlash: 'always',
  adapter: cloudflare({
    // Static pages are prerendered by Node as before, images optimised at build time.
    prerenderEnvironment: 'node',
    imageService: 'compile',
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
