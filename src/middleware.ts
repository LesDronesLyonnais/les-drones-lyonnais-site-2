// Account area guard. Runs on the on-demand pages only (the public site is prerendered):
// loads the signed-in user into Astro.locals.user, sends signed-out visitors of /compte/
// and /admin/ to /connexion/, and keeps /admin/ for administrators.
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();
  const path = context.url.pathname;
  const area = path.startsWith('/admin/') ? 'admin' : path.startsWith('/compte/') ? 'compte' : path.startsWith('/connexion/') ? 'connexion' : null;
  if (!area) return next();

  const { sessionUser, needsPassword } = await import('./lib/server/auth');
  const user = await sessionUser(context.cookies);
  context.locals.user = user;

  if (area !== 'connexion' && !user) return context.redirect(`/connexion/?suite=${encodeURIComponent(path + context.url.search)}`);
  // Temporary password (or reset link): choose one before anything else.
  if (area !== 'connexion' && user && needsPassword(user) && path !== '/compte/mot-de-passe/') return context.redirect('/compte/mot-de-passe/');
  if (area === 'admin' && user?.role !== 'admin') return context.redirect('/compte/');

  const response = await next();
  // Private pages: never cached, never indexed.
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex');
  return response;
});
