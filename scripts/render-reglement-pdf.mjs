// Renders the internal rules page (/reglement-interieur/) to the PDF given to trainees and
// linked on the page: public/documents/reglement-interieur-les-drones-lyonnais.pdf.
// Run with the site served locally (npm run dev, or a preview URL as first argument):
//   node scripts/render-reglement-pdf.mjs [http://localhost:4321]
// Uses the page's print styles (header, footer, contents hidden) and adds a footer with the
// company's details and the page number. Regenerate after any change to the page.
import { createRequire } from 'node:module';

// Playwright is installed globally (as for scripts/render-deliverables.mjs).
const { chromium } = createRequire(import.meta.url)('playwright');

const base = process.argv[2] ?? 'http://localhost:4321';
const out = 'public/documents/reglement-interieur-les-drones-lyonnais.pdf';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base}/reglement-interieur/`, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  margin: { top: '16mm', bottom: '20mm', left: '16mm', right: '16mm' },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: `<div style="width:100%;font-size:7px;color:#666;padding:0 16mm;display:flex;justify-content:space-between;font-family:Arial,sans-serif">
    <span>Les Drones Lyonnais – 283 rue de l’Étang, 69760 Limonest – SIRET 894 357 755 00012 – Déclaration d’activité n° 84 69 19979 69 (Auvergne-Rhône-Alpes)</span>
    <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
  </div>`,
});
await browser.close();
console.log(`PDF written to ${out}`);
