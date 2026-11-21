// Business data shared across the site. One source of truth for contact details,
// activities and navigation — pages and components read from here.

export const SITE = {
  name: 'Les Drones Lyonnais',
  url: 'https://www.lesdroneslyonnais.com',
  locale: 'fr_FR',
  city: 'Lyon',
  phone: '04 12 24 03 87',
  phoneHref: 'tel:+33412240387',
  email: 'contact@lesdroneslyonnais.com',
  contactPath: '/contact/',
  // Office, from the contact page of the current site.
  address: { street: '283 rue de l’Étang', postalCode: '69760', locality: 'Limonest' },
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=283%20rue%20de%20l%27%C3%89tang%2069760%20Limonest',
  /** Opening hours, Europe/Paris: Monday (1) to Saturday (6), 9:00–19:00. */
  hours: { label: 'Du lundi au samedi, 9 h – 19 h', days: [1, 2, 3, 4, 5, 6], open: 9, close: 19 },
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/les-drones-lyonnais/' },
    { label: 'Instagram', href: 'https://www.instagram.com/lesdroneslyonnais/' },
    { label: 'YouTube', href: 'https://www.youtube.com/@lesdroneslyonnais' },
  ],
} as const;

/** The four activities. `color` is the CSS token of the activity's LDL square. */
export type ActivityId = 'prestations' | 'formations' | 'boutique' | 'location';

export interface Activity {
  id: ActivityId;
  label: string;
  href: string;
  color: string;
}

// URLs are the ones indexed on the current WordPress site.
export const ACTIVITIES: Record<ActivityId, Activity> = {
  prestations: { id: 'prestations', label: 'Prestations', href: '/prestations/', color: 'var(--color-prestations)' },
  formations: { id: 'formations', label: 'Formations', href: '/formations-drone-a-lyon/', color: 'var(--color-formations)' },
  boutique: { id: 'boutique', label: 'Boutique', href: '/boutique/', color: 'var(--color-boutique)' },
  location: { id: 'location', label: 'Location', href: '/location-drone-et-camera/', color: 'var(--color-location)' },
};

export const NAV: Activity[] = [ACTIVITIES.prestations, ACTIVITIES.formations, ACTIVITIES.boutique, ACTIVITIES.location];

/** Legal identity of the company, for the legal notice and the terms. From the public
 *  company register (recherche-entreprises.api.gouv.fr, checked on 2026-11-21) — name,
 *  form (5499 = SARL), SIREN / SIRET, registered office, APE code, manager, training body
 *  number and Qualiopi — and from the legal notice of the current site (capital, 2022).
 *  The capital and the RCS registry (Morancé → Villefranche-Tarare) are to be confirmed on
 *  the Kbis. The registered office is not the office of the contact page (SITE.address). */
export const COMPANY = {
  legalName: 'Les Drones Lyonnais',
  form: 'Société à responsabilité limitée (SARL)',
  capital: '1 000 €',
  siren: '894 357 755',
  siret: '894 357 755 00012',
  rcs: 'RCS Villefranche-Tarare 894 357 755',
  vat: 'FR24 894 357 755',
  ape: '59.11B – Production de films institutionnels et publicitaires',
  headOffice: { street: '400 chemin de la Radissonne', postalCode: '69480', locality: 'Morancé' },
  /** Manager (gérant), director of publication. */
  director: 'Dylan Castano',
  training: { nda: '84 69 19979 69', region: 'Auvergne-Rhône-Alpes', qualiopi: true },
} as const;

/** Host of the site (LCEN art. 6): name, address, phone. */
export const HOST = {
  name: 'Cloudflare, Inc.',
  address: '101 Townsend Street, San Francisco, CA 94107, États-Unis',
  phone: '+1 650 319 8930',
  url: 'https://www.cloudflare.com',
} as const;

// Legal pages: not linked on the current site yet, to be created with the migration.
export const LEGAL = [
  { label: 'Mentions légales', href: '/mentions-legales/' },
  { label: 'Politique de confidentialité', href: '/politique-de-confidentialite/' },
  { label: 'Conditions générales', href: '/conditions-generales/' },
];
