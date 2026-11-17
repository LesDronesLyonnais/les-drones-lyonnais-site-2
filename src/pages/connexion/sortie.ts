// Sign out (POST from the account bar): ends the session and goes back to the home page.
import type { APIRoute } from 'astro';
import { endSession } from '../../lib/server/auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  await endSession(cookies);
  return redirect('/');
};
