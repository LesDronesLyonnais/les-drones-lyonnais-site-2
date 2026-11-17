// Labels and formatting shared by the customer area (/compte/) and the admin (/admin/).

export const ROLE_LABEL = {
  admin: 'Administrateur',
  boutique: 'Client boutique',
  prestation: 'Client prestations',
} as const;

export const ORDER_STATUS = {
  en_attente: 'En attente',
  en_preparation: 'En préparation',
  expediee: 'Expédiée',
  livree: 'Livrée',
  annulee: 'Annulée',
} as const;

export const MISSION_STATUS = {
  planifiee: 'Planifiée',
  realisee: 'Réalisée',
  livree: 'Livrables disponibles',
  annulee: 'Annulée',
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;
export type MissionStatus = keyof typeof MISSION_STATUS;

export interface Order {
  id: number;
  user_id: number;
  number: string;
  ordered_on: string;
  status: OrderStatus;
  items: string;
  total_ttc: number;
  note: string;
}
export interface OrderItem {
  name: string;
  qty: number;
  priceTTC: number;
}
export interface Mission {
  id: number;
  user_id: number;
  title: string;
  service: string;
  mission_on: string;
  place: string;
  details: string;
  status: MissionStatus;
}
export interface Deliverable {
  id: number;
  mission_id: number;
  name: string;
  file_key: string;
  size: number;
  content_type: string;
  created_at: string;
}
export interface Invoice {
  id: number;
  user_id: number;
  order_id: number | null;
  mission_id: number | null;
  number: string;
  issued_on: string;
  amount_ttc: number;
  file_key: string;
}

export const orderItems = (o: Order): OrderItem[] => {
  try {
    return JSON.parse(o.items) as OrderItem[];
  } catch {
    return [];
  }
};

const dateFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
/** "2026-11-17" → "17 novembre 2026". */
export const formatDate = (iso: string) => (iso ? dateFmt.format(new Date(iso.slice(0, 10) + 'T00:00:00Z')) : '');
export const formatEuro = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n).replace(/ /g, ' ');
export const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} Ko` : bytes < 1024 ** 3 ? `${(bytes / 1024 ** 2).toFixed(1).replace('.', ',')} Mo` : `${(bytes / 1024 ** 3).toFixed(2).replace('.', ',')} Go`;

/** Download links (checked against the signed-in user by the endpoint). */
export const invoiceUrl = (i: Pick<Invoice, 'id'>) => `/compte/fichier/facture/${i.id}/`;
export const deliverableUrl = (d: Pick<Deliverable, 'id'>) => `/compte/fichier/livrable/${d.id}/`;
