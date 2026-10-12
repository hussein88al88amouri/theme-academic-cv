const RECIPIENT = 'alamourihusein@gmail.com';
const BCC = 'h.elamouri@usal.edu.lb';
const SITE = 'https://hussein-el-amouri.netlify.app';
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const MAX_BODY_BYTES = 128 * 1024;

export const config = {
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip'] },
};

function reply(request, status, message, accepted = false) {
  const wantsJSON = (request.headers.get('accept') || '').includes('application/json');
  if (accepted && !wantsJSON) {
    return new Response(null, { status: 303, headers: { Location: `${SITE}/contact/thanks/`, 'Cache-Control': 'no-store' } });
  }
  if (wantsJSON) {
    return Response.json({ accepted, message }, { status, headers: { 'Cache-Control': 'no-store' } });
  }
  // Messages are fixed server strings; visitor input is never inserted into HTML.
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Contact message</title><p>${message}</p><p><a href="${SITE}/#contact">Return to contact form</a></p><p><a href="mailto:${RECIPIENT}">Email directly</a></p></html>`, {
    status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export default async function contact(request) {
  if (request.method !== 'POST') return reply(request, 405, 'Please submit the contact form.');
  const origin = request.headers.get('origin');
  if (origin && ![SITE, 'https://hussein88al88amouri.github.io'].includes(origin)) {
    return reply(request, 403, 'This submission origin is not supported. Please use the primary website.');
  }
  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/x-www-form-urlencoded')) {
    return reply(request, 415, 'Please use the website contact form.');
  }
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) return reply(request, 413, 'The message is too long.');
  let data;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) return reply(request, 413, 'The message is too long.');
    data = new URLSearchParams(body);
  } catch {
    return reply(request, 400, 'The submitted message could not be read.');
  }
  if (data.get('form-name') !== 'research-contact') return reply(request, 400, 'Please use the website contact form.');
  if (data.get('website')) return reply(request, 400, 'The message could not be submitted.');
  const name = (data.get('name') || '').trim();
  const email = (data.get('email') || '').trim();
  const subject = (data.get('subject') || '').trim();
  const message = (data.get('message') || '').trim();
  if (!EMAIL.test(email) || email.length > 254 || !subject || subject.length > 300 || /[\r\n]/.test(subject) || !message || message.length > 10000 || name.length > 200 || /[\r\n]/.test(name)) {
    return reply(request, 400, 'Please enter a valid email, subject, and message within the form limits.');
  }
  const apiKey = process.env.BREVO_API_KEY;
  const sender = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !sender || !EMAIL.test(sender)) {
    return reply(request, 503, 'Email delivery is not configured yet. Please use the direct email link.');
  }
  try {
    const result = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        sender: { email: sender, name: 'Hussein El Amouri · Research portfolio' },
        to: [{ email: RECIPIENT }],
        bcc: [{ email: BCC }],
        replyTo: { email, ...(name ? { name } : {}) },
        subject: `[Research portfolio] ${subject}`,
        textContent: `From: ${name || 'Website visitor'}\nReply email: ${email}\nSubject: ${subject}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!result.ok) return reply(request, 502, 'Email could not be accepted for delivery. Please try again or email directly.');
    const receipt = await result.json();
    if (!receipt.messageId) return reply(request, 502, 'Email delivery could not be confirmed. Please email directly.');
    return reply(request, 202, 'Your message has been submitted for email delivery. Thank you.', true);
  } catch {
    return reply(request, 502, 'Email could not be accepted for delivery. Please try again or email directly.');
  }
}
