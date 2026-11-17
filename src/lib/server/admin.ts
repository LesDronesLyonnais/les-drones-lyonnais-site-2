// Helpers of the admin pages (/admin/): form fields, R2 uploads, order lines.
import { files } from './auth';
import type { OrderItem } from '../account';

export const text = (form: FormData, key: string, max = 500) => String(form.get(key) ?? '').trim().slice(0, max);
export const amount = (form: FormData, key: string) => {
  const n = Number(text(form, key, 30).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : 0;
};
export const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
export const today = () => new Date().toISOString().slice(0, 10);
export const oneOf = <T extends string>(value: string, allowed: readonly T[], fallback: T): T => ((allowed as readonly string[]).includes(value) ? (value as T) : fallback);

/** A file from a form, if one was chosen. */
export const fileOf = (form: FormData, key: string) => {
  const f = form.get(key);
  return f instanceof File && f.size > 0 ? f : null;
};
export const filesOf = (form: FormData, key: string) => form.getAll(key).filter((f): f is File => f instanceof File && f.size > 0);

/** Stores a file in R2 under prefix/<random>-<name>; returns its key. */
export async function storeFile(prefix: string, file: File): Promise<string> {
  const safe = file.name.normalize('NFKD').replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '').slice(-120) || 'fichier';
  const key = `${prefix}/${crypto.randomUUID()}-${safe}`;
  await files().put(key, file.stream(), { httpMetadata: { contentType: file.type || 'application/octet-stream' } });
  return key;
}
export const removeFile = (key: string) => files().delete(key);

/** Order lines typed one per line: "2 × Batterie pour DJI Matrice 5T — 511" (quantity,
 *  name, unit price TTC). A line without quantity or price counts 1 and 0 €. */
export function parseItems(raw: string): OrderItem[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(?:(\d+)\s*[x×*]\s*)?(.+?)(?:\s*[—–\-:|]\s*([\d\s.,]+)\s*€?)?$/);
      const qty = Number(m?.[1] ?? 1) || 1;
      const priceTTC = Number((m?.[3] ?? '0').replace(/\s/g, '').replace(',', '.')) || 0;
      return { qty, name: (m?.[2] ?? line).slice(0, 200), priceTTC: Math.round(priceTTC * 100) / 100 };
    });
}
export const itemsText = (items: OrderItem[]) => items.map((i) => `${i.qty} × ${i.name} — ${String(i.priceTTC).replace('.', ',')}`).join('\n');

/** Redirect back with a message (?ok=…) after an action. */
export const back = (path: string, message: string) => `${path}?ok=${encodeURIComponent(message)}`;
