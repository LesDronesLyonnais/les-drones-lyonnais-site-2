// E-mails through Brevo (the provider the LDL Academy app already uses), transactional
// API v3. The key is a Worker secret, BREVO_API_KEY_SITE (as the client named it in the
// Cloudflare dashboard; BREVO_API_KEY also read), never in the repo. Without it
// nothing is sent and the reason is logged: the pages keep working.
// One sender address (MAIL_FROM, default SITE.email, verified in Brevo) with a name per
// audience, as the client asked: LDL Prestations / Formations / Boutique / Location.
import { env } from 'cloudflare:workers';
import { SITE } from '../../data/site';

type MailEnv = { BREVO_API_KEY_SITE?: string; BREVO_API_KEY?: string; MAIL_FROM?: string; CONTACT_NOTIFY_TO?: string };
const conf = () => env as unknown as MailEnv;

export const SENDER_NAME = {
  prestations: 'LDL Prestations',
  formations: 'LDL Formations',
  boutique: 'LDL Boutique',
  location: 'LDL Location',
  autre: 'Les Drones Lyonnais',
} as const;
export type Audience = keyof typeof SENDER_NAME;

/** Address of the team (contact form notifications). */
export const teamAddress = () => conf().CONTACT_NOTIFY_TO || SITE.email;

export interface Mail {
  audience: Audience;
  to: { email: string; name?: string };
  replyTo?: { email: string; name?: string };
  subject: string;
  html: string;
  text: string;
}

export async function sendMail(mail: Mail): Promise<boolean> {
  const key = conf().BREVO_API_KEY_SITE || conf().BREVO_API_KEY;
  if (!key) {
    console.log(`[mail] BREVO_API_KEY_SITE absent, e-mail non envoyé : ${mail.subject}`);
    return false;
  }
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      signal: AbortSignal.timeout(15_000),
      headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: SENDER_NAME[mail.audience], email: conf().MAIL_FROM || SITE.email },
        to: [mail.to.name ? mail.to : { email: mail.to.email }],
        ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
        subject: mail.subject,
        htmlContent: mail.html,
        textContent: mail.text,
      }),
    });
    if (!res.ok) {
      console.log(`[mail] Brevo ${res.status} : ${(await res.text()).slice(0, 300)}`);
      return false;
    }
    return true;
  } catch (e) {
    console.log(`[mail] Brevo injoignable : ${String(e).slice(0, 200)}`);
    return false;
  }
}

/** Lets the response go out at once and the e-mails finish after it (Cloudflare
 *  waitUntil); where there is no such context (some dev setups), waits for them. */
export function inBackground(locals: unknown, work: Promise<unknown>): Promise<unknown> {
  const cf = (locals as { cfContext?: { waitUntil(p: Promise<unknown>): void } }).cfContext;
  if (cf?.waitUntil) {
    cf.waitUntil(work);
    return Promise.resolve();
  }
  return work;
}

// ---------- Layout shared by every e-mail ----------

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Escaped, with line breaks kept. */
export const escLines = (s: string) => esc(s).replace(/\r?\n/g, '<br>');

/** A plain, robust layout: white card, black text, the gold line of the brand. */
export function layout(audience: Audience, body: string) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f1f1ef;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f1ef;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-top:4px solid #af854a;font-family:Arial,Helvetica,sans-serif;color:#000000;">
<tr><td style="padding:28px 32px 8px;font-size:13px;letter-spacing:.04em;color:#5c5c5c;">${esc(SENDER_NAME[audience])}</td></tr>
<tr><td style="padding:8px 32px 32px;font-size:16px;line-height:1.55;">${body}</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #e3e3e1;font-size:13px;line-height:1.5;color:#5c5c5c;">
${esc(SITE.name)} · ${esc(SITE.address.street)}, ${esc(SITE.address.postalCode)} ${esc(SITE.address.locality)}<br>
<a href="${SITE.phoneHref}" style="color:#5c5c5c;">${esc(SITE.phone)}</a> · <a href="mailto:${esc(SITE.email)}" style="color:#5c5c5c;">${esc(SITE.email)}</a> · ${esc(SITE.hours.label)}
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/** Key / value rows (escaped). */
export const rows = (items: [string, string][]) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:16px 0;border-collapse:collapse;">${items
    .map(([k, v]) => `<tr><td style="padding:8px 12px 8px 0;border-top:1px solid #e3e3e1;color:#5c5c5c;font-size:14px;width:120px;vertical-align:top;">${esc(k)}</td><td style="padding:8px 0;border-top:1px solid #e3e3e1;font-size:15px;">${escLines(v)}</td></tr>`)
    .join('')}</table>`;

export const button = (href: string, label: string) =>
  `<p style="margin:24px 0 0;"><a href="${esc(href)}" style="display:inline-block;background:#000000;color:#ffffff;text-decoration:none;font-weight:bold;padding:14px 22px;">${esc(label)}</a></p>`;
