// How the shop is organised (client request, 2026-11-20: "the products are a parade with no
// logic"): by use, then by drone family, each family showing its versions (the drone
// itself, Fly More, Combo, certified C5…) and the accessories made for it. Built from the
// catalogue on every build: a new product joins its family by its name.
import type { ImageMetadata } from 'astro';
import { forSale, type Product } from './catalog';

import heroMavic from '../assets/shop/hero-mavic-4-pro.jpg';
import heroMini from '../assets/shop/hero-mini-5-pro.jpg';
import heroNeo from '../assets/shop/hero-neo-2.jpg';
import heroMatrice4 from '../assets/shop/hero-matrice-4.jpg';
import usageDebuter from '../assets/shop/usage-debuter.jpg';
import usageVideo from '../assets/shop/usage-video.jpg';
import usageFpv from '../assets/shop/usage-fpv.jpg';
import usageInspection from '../assets/shop/usage-inspection.jpg';
import famLito from '../assets/shop/fam-lito-x1.jpg';
import famMatrice5t from '../assets/shop/fam-matrice-5t.jpg';
import famMatrice400 from '../assets/shop/fam-matrice-400.jpg';
import famCapteurs from '../assets/shop/fam-capteurs.jpg';
import famAir from '../assets/shop/fam-air-3s.jpg';
// Lito X1 and Air 3S above: DJI photos from the product galleries of the current site.
// Lifestyle photos from the product galleries (DJI), already in the catalogue.
import famMini from '../assets/products/dji-mini-5-pro-standard-combo-2.webp';
import famNeo from '../assets/products/dji-neo-2-4.webp';
import famAvata360 from '../assets/products/dji-avata-360-rc2-3.webp';
import famMavic from '../assets/products/dji-mavic-4-pro-creator-combo-512go-rc-pro-2-4.webp';
import famMatrice4 from '../assets/products/dji-matrice-4t-3.webp';
import famInspire from '../assets/products/dji-inspire-3-standard-4.webp';

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
const isDrone = (p: Product) => p.categories.includes('drones') && !/^kit /i.test(p.name) && !/demarrage/.test(norm(p.name));
const nameHas = (p: Product, terms: string[]) => terms.some((t) => norm(p.name).includes(t));

export type UsageId = 'debuter' | 'video' | 'fpv' | 'inspection' | 'cinema';

export interface Family {
  id: string;
  name: string;
  usage: UsageId;
  /** Short promise, from the shop menu. */
  tagline: string;
  photo: ImageMetadata;
  /** Where the subject sits in the photo (object-position). */
  focus?: string;
  /** Words that put a product in this family (in its name, lower case, no accents). */
  terms: string[];
  /** Extra words for accessories only (lenses of the Inspire 3's camera…). */
  accessoryTerms?: string[];
  /** Words that keep a product out (Matrice 4 ≠ Matrice 400). */
  exclude?: string[];
}

export const FAMILIES: Family[] = [
  { id: 'mini-5-pro', name: 'DJI Mini 5 Pro', usage: 'debuter', tagline: 'Moins de 250 g, idéal pour débuter.', photo: famMini, terms: ['mini 5'] },
  { id: 'neo-2', name: 'DJI Neo 2', usage: 'debuter', tagline: 'Ultra-léger, se pilote même à la main.', photo: famNeo, terms: ['neo'] },
  { id: 'lito-x1', name: 'DJI Lito X1', usage: 'debuter', tagline: 'Compact et simple, pour bien démarrer.', photo: famLito, focus: '30% 50%', terms: ['lito'] },
  { id: 'air-3s', name: 'DJI Air 3S', usage: 'video', tagline: 'Le polyvalent : léger et très bien équipé.', photo: famAir, terms: ['air 3'] },
  { id: 'mavic-4-pro', name: 'DJI Mavic 4 Pro', usage: 'video', tagline: 'Trois caméras, qualité d’image de référence.', photo: famMavic, terms: ['mavic 4'] },
  { id: 'avata-360', name: 'DJI Avata 360', usage: 'fpv', tagline: 'Immersif, pour voler en FPV, à 360°.', photo: famAvata360, terms: ['avata 360'] },
  { id: 'avata-2', name: 'DJI Avata 2', usage: 'fpv', tagline: 'Immersif, pour voler en FPV.', photo: usageFpv, terms: ['avata 2'] },
  { id: 'matrice-4', name: 'DJI Matrice 4', usage: 'inspection', tagline: 'Inspection et cartographie, compact et précis.', photo: famMatrice4, terms: ['matrice 4e', 'matrice 4t', 'matrice 4 series'] },
  { id: 'matrice-5t', name: 'DJI Matrice 5T', usage: 'inspection', tagline: 'Thermique et zoom, de jour comme de nuit.', photo: famMatrice5t, terms: ['matrice 5t'] },
  { id: 'matrice-400', name: 'DJI Matrice 400', usage: 'inspection', tagline: 'La plateforme industrielle la plus endurante.', photo: famMatrice400, terms: ['matrice 400'], accessoryTerms: ['tb100', 'bs100'] },
  { id: 'inspire-3', name: 'DJI Inspire 3', usage: 'cinema', tagline: 'Cinéma aérien plein format 8K.', photo: famInspire, terms: ['inspire 3'], accessoryTerms: ['zenmuse x9', 'zenmuse x7'] },
];

export interface Usage {
  id: UsageId;
  title: string;
  text: string;
  photo: ImageMetadata;
  focus?: string;
}

export const USAGES: Usage[] = [
  { id: 'debuter', title: 'Débuter et voler pour le plaisir', text: 'Légers et simples : au plus la formation en ligne A1/A3.', photo: usageDebuter, focus: '70% 50%' },
  { id: 'video', title: 'Filmer ses voyages et ses projets', text: 'Des images de qualité pro dans un drone qui se glisse dans un sac.', photo: usageVideo, focus: '50% 60%' },
  { id: 'fpv', title: 'Vivre le vol en immersion', text: 'Lunettes sur les yeux, pour des plans dynamiques et des sensations.', photo: usageFpv },
  { id: 'inspection', title: 'Inspecter, mesurer, cartographier', text: 'Thermique, zoom, photogrammétrie et LiDAR pour les professionnels.', photo: usageInspection },
  { id: 'cinema', title: 'Tourner du cinéma', text: 'Le plein format en vol, pour les productions exigeantes.', photo: famInspire, focus: '40% 50%' },
];

// ---------------------------------------------------------------------------

const inFamily = (f: Family) => (p: Product) => nameHas(p, f.terms) && !nameHas(p, f.exclude ?? []) && !(f.id === 'matrice-4' && nameHas(p, ['matrice 400']));

/** The drone versions of a family, cheapest first. */
export const versionsOf = (f: Family) => forSale.filter((p) => isDrone(p) && inFamily(f)(p)).sort((a, b) => a.priceTTC - b.priceTTC);

/** Accessories made for a family: batteries, chargers, filters, C5 kits, lenses… */
export const accessoriesOf = (f: Family) =>
  forSale
    .filter((p) => !isDrone(p) && (inFamily(f)(p) || nameHas(p, f.accessoryTerms ?? [])))
    .sort((a, b) => a.priceTTC - b.priceTTC);

export const fromPrice = (list: Product[]) => (list.length ? Math.min(...list.map((p) => p.priceTTC)) : null);

/** Name of a version without the family's name: "DJI Mavic 4 PRO Fly More Combo (RC2)" →
 *  "Fly More Combo (RC2)". The family's words are dropped only if they all match, word for
 *  word, accents aside ("DJI Matrice 4E" stays "Matrice 4E"); nothing left (the drone
 *  itself) gives "Version standard". */
export function versionLabel(f: Family, p: Product) {
  const words = p.name.replace(/^dji\s+/i, '').split(/\s+/);
  const family = norm(f.name.replace(/^DJI\s+/, '')).split(/\s+/);
  const match = family.every((w, i) => norm(words[i] ?? '') === w);
  let s = (match ? words.slice(family.length) : words).join(' ').replace(/^[–—-]\s*/, '').trim();
  if (!s) return 'Version standard';
  if (s.startsWith('(')) s = `Version standard ${s}`;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const inAnyFamily = (p: Product) => FAMILIES.some((f) => inFamily(f)(p) || nameHas(p, f.accessoryTerms ?? []));

/** Payloads and positioning for the professional drones. */
export const SENSORS = forSale.filter((p) => !inAnyFamily(p) && (p.categories.some((c) => c.startsWith('capteur')) || nameHas(p, ['zenmuse', 'd-rtk'])));
export const sensorsPhoto = famCapteurs;

/** Everything else: piloting, storage, field gear, multi-drone batteries and chargers. */
export const OTHER_GEAR = forSale.filter((p) => !inAnyFamily(p) && !SENSORS.includes(p) && !isDrone(p));

/** The full catalogue in the same logic: family by family (drone, then accessories), then sensors, then the rest. */
export const CATALOGUE_ORDER: Product[] = (() => {
  const seen = new Set<string>();
  const out: Product[] = [];
  const push = (list: Product[]) => list.forEach((p) => !seen.has(p.slug) && (seen.add(p.slug), out.push(p)));
  for (const f of FAMILIES) push([...versionsOf(f), ...accessoriesOf(f)]);
  push(SENSORS);
  push(OTHER_GEAR);
  push(forSale);
  return out;
})();

// ---------------------------------------------------------------------------
// Showcase at the top of the page: the best sellers of the current site.

export interface Slide {
  family: string;
  label: string;
  title: string;
  text: string;
  photo: ImageMetadata;
  focus?: string;
}

export const SHOWCASE: Slide[] = [
  { family: 'mavic-4-pro', label: 'Meilleure vente', title: 'DJI Mavic 4 Pro', text: 'Trois caméras, qualité d’image de référence. Aussi en version certifiée C5.', photo: heroMavic, focus: '50% 40%' },
  { family: 'mini-5-pro', label: 'Meilleure vente', title: 'DJI Mini 5 Pro', text: 'Moins de 250 g, idéal pour débuter, avec une image de grand drone.', photo: heroMini, focus: '45% 45%' },
  { family: 'neo-2', label: 'Meilleure vente', title: 'DJI Neo 2', text: 'Ultra-léger, il se pilote même à la main.', photo: heroNeo, focus: '50% 50%' },
  { family: 'matrice-4', label: 'Meilleure vente pro', title: 'DJI Matrice 4', text: 'Inspection et cartographie, compact et précis. Versions 4E, 4T et certifiées C5.', photo: heroMatrice4, focus: '50% 45%' },
];
