// Private files from R2: an invoice (/compte/fichier/facture/<id>/) or a deliverable
// (/compte/fichier/livrable/<id>/). Served only to the client they belong to, or to an
// admin. The middleware already requires a signed-in user.
import type { APIRoute } from 'astro';
import { db, files } from '../../../../lib/server/auth';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  const user = locals.user!;
  const id = Number(params.id);
  if (!Number.isInteger(id)) return new Response('Introuvable', { status: 404 });
  const admin = user.role === 'admin';

  const row =
    params.kind === 'facture'
      ? await db().prepare('SELECT file_key, number AS name, user_id FROM invoices WHERE id = ?').bind(id).first<{ file_key: string; name: string; user_id: number }>()
      : params.kind === 'livrable'
        ? await db()
            .prepare('SELECT d.file_key, d.name, m.user_id FROM deliverables d JOIN missions m ON m.id = d.mission_id WHERE d.id = ?')
            .bind(id)
            .first<{ file_key: string; name: string; user_id: number }>()
        : null;
  // Someone else's file answers like a missing one.
  if (!row || (!admin && row.user_id !== user.id)) return new Response('Introuvable', { status: 404 });

  const object = await files().get(row.file_key);
  if (!object) return new Response('Fichier introuvable', { status: 404 });

  const filename = params.kind === 'facture' ? `Facture-${row.name}.pdf` : row.name;
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Content-Length', String(object.size));
  headers.set('Content-Disposition', `${params.kind === 'facture' ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(filename)}`);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(object.body, { headers });
};
