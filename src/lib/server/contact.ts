// Contact page (/contact/): what the visitor came for, read from the link that led there,
// and the messages stored in D1 (contact_requests) for the team (/admin/demandes/).
// The context is always rebuilt here from the catalogue, never taken from the form as text.
import { db, isEmail, normEmail } from './auth';
import { SITE, type ActivityId } from '../../data/site';
import { serviceOf } from '../../data/service-pages';
import { FORMATIONS } from '../../data/formations';
import { PRODUCTS, formatPrice } from '../../data/catalog';

export type Topic = ActivityId | 'autre';
export const TOPICS: { id: Topic; label: string; color: string }[] = [
  { id: 'prestations', label: 'Une prestation', color: 'var(--color-prestations)' },
  { id: 'formations', label: 'Une formation', color: 'var(--color-formations)' },
  { id: 'boutique', label: 'Un achat', color: 'var(--color-boutique)' },
  { id: 'location', label: 'Une location', color: 'var(--color-location)' },
  { id: 'autre', label: 'Autre chose', color: 'var(--color-gold)' },
];
export const TOPIC_LABEL: Record<Topic, string> = {
  prestations: 'Prestation',
  formations: 'Formation',
  boutique: 'Boutique',
  location: 'Location',
  autre: 'Autre',
};

/** The link parameters the site's buttons use (kept as hidden fields in the form). */
export const CONTEXT_KEYS = ['prestation', 'formation', 'commande', 'location', 'du', 'au'] as const;
export type ContextParams = Partial<Record<(typeof CONTEXT_KEYS)[number], string>>;

export interface Prefill {
  topic: Topic;
  subject: string;
  /** What the request is about, one line each (shown on the page, stored with it). */
  lines: string[];
  /** Short title of the box above the form. */
  title: string;
  /** Where "modifier" goes back to. */
  back?: { label: string; href: string };
}

const humanize = (slug: string) => {
  const s = slug.replace(/-\d+$/, '').replace(/-/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};
const isDate = (s?: string) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
const frDate = (s: string) => new Date(`${s}T12:00:00Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });

export function readContext(get: (key: string) => string | null): ContextParams {
  const out: ContextParams = {};
  for (const k of CONTEXT_KEYS) {
    const v = (get(k) ?? '').trim().slice(0, 2000);
    if (v) out[k] = v;
  }
  return out;
}

/** What to pre-fill from the button that led to the page; null for a plain visit. */
export function prefillOf(c: ContextParams): Prefill | null {
  if (c.commande) {
    const items = c.commande
      .split(',')
      .map((part) => {
        const [slug, qty] = part.split('*');
        const p = PRODUCTS.find((x) => x.slug === decodeURIComponent(slug ?? '') && x.kind === 'vente');
        const n = Math.min(99, Math.max(1, Number.parseInt(qty ?? '1', 10) || 1));
        return p ? { p, n } : null;
      })
      .filter((x): x is NonNullable<typeof x> => !!x)
      .slice(0, 40);
    if (items.length) {
      const total = items.reduce((t, { p, n }) => t + p.priceTTC * n, 0);
      const count = items.reduce((t, { n }) => t + n, 0);
      return {
        topic: 'boutique',
        title: 'Votre panier',
        subject: `Commande boutique (${count} article${count > 1 ? 's' : ''})`,
        lines: [...items.map(({ p, n }) => `${n} × ${p.name} · ${formatPrice(p.priceTTC * n)} TTC`), `Total : ${formatPrice(total)} TTC`],
      };
    }
  }
  if (c.location) {
    const p = PRODUCTS.find((x) => x.slug === c.location && x.kind === 'location');
    if (p) {
      const dates = isDate(c.du) && isDate(c.au) ? `Du ${frDate(c.du!)} au ${frDate(c.au!)}` : isDate(c.du) ? `À partir du ${frDate(c.du!)}` : 'Dates à définir';
      return {
        topic: 'location',
        title: 'Votre réservation',
        subject: `Réservation : ${p.name}`,
        lines: [p.name, dates, `À partir de ${formatPrice(p.priceTTC)} TTC / jour`],
        back: { label: 'Modifier', href: `/produit/${p.slug}/#reservation` },
      };
    }
  }
  if (c.formation) {
    const f = FORMATIONS.find((x) => x.id === c.formation);
    if (f) return { topic: 'formations', title: 'Votre formation', subject: `Formation : ${f.title}`, lines: [f.title, [f.scope, f.duration].filter(Boolean).join(' · ')].filter(Boolean) };
  }
  if (c.prestation && /^[a-z0-9-]{2,80}$/.test(c.prestation)) {
    const label = serviceOf(c.prestation)?.label ?? humanize(c.prestation);
    return { topic: 'prestations', title: 'Votre prestation', subject: `Demande de devis : ${label}`, lines: [label] };
  }
  return null;
}

/** Open now? Europe/Paris, from SITE.hours. */
export function openingStatus(now = new Date()): { open: boolean; text: string } {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(now).map((p) => [p.type, p.value]));
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  const hour = Number(parts.hour) + Number(parts.minute) / 60;
  const { days, open, close } = SITE.hours;
  const isDay = (d: number) => (days as readonly number[]).includes(d);
  if (isDay(day) && hour >= open && hour < close) return { open: true, text: `Ouvert en ce moment, jusqu’à ${close} h` };
  // Next opening: later today, tomorrow, or Monday.
  const NAMES = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  if (isDay(day) && hour < open) return { open: false, text: `Fermé, ouverture aujourd’hui à ${open} h` };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    if (isDay(d)) return { open: false, text: `Fermé, réouverture ${i === 1 ? 'demain' : NAMES[d]} à ${open} h` };
  }
  return { open: false, text: 'Fermé' };
}

export interface ContactInput {
  topic: Topic;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
export type FieldErrors = Partial<Record<keyof ContactInput | 'form', string>>;

const field = (form: FormData, key: string, max: number) => String(form.get(key) ?? '').trim().slice(0, max);

/** Reads and checks the form. Bots: a hidden field humans leave empty and a minimum time. */
export function readForm(form: FormData): { input: ContactInput; errors: FieldErrors; bot: boolean } {
  const topic = field(form, 'topic', 20) as Topic;
  const input: ContactInput = {
    topic: TOPICS.some((t) => t.id === topic) ? topic : 'autre',
    name: field(form, 'name', 120),
    email: normEmail(field(form, 'email', 200)),
    phone: field(form, 'phone', 40),
    subject: field(form, 'subject', 160),
    message: field(form, 'message', 5000),
  };
  const errors: FieldErrors = {};
  if (!isEmail(input.email)) errors.email = 'Indiquez une adresse e-mail valide, pour que l’on puisse vous répondre.';
  if (!input.subject) errors.subject = 'Donnez un sujet à votre message.';
  if (input.message.length < 5) errors.message = 'Écrivez-nous quelques mots sur votre projet.';
  if (input.phone && !/^[+()\d .-]{6,}$/.test(input.phone)) errors.phone = 'Ce numéro de téléphone ne semble pas valide.';
  const shownAt = Number(field(form, 't', 20));
  const bot = !!field(form, 'site_web', 200) || !shownAt || Date.now() - shownAt < 2500;
  return { input, errors, bot };
}

/** Stores the request; false when the same address already sent too many in the last hour. */
export async function saveRequest(input: ContactInput, context: string[]): Promise<boolean> {
  const recent = await db()
    .prepare("SELECT COUNT(*) AS n FROM contact_requests WHERE email = ? AND created_at > datetime('now', '-1 hour')")
    .bind(input.email)
    .first<{ n: number }>();
  if ((recent?.n ?? 0) >= 5) return false;
  await db()
    .prepare('INSERT INTO contact_requests (topic, name, email, phone, subject, message, context) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(input.topic, input.name, input.email, input.phone, input.subject, input.message, context.join('\n'))
    .run();
  return true;
}

export interface ContactRequest extends ContactInput {
  id: number;
  context: string;
  status: 'nouvelle' | 'traitee';
  created_at: string;
}
