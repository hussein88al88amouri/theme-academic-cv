import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import contact, { config } from '../netlify/functions/contact.mjs';

let originalFetch, originalKey, originalSender, calls;
beforeEach(() => {
  originalFetch = globalThis.fetch;
  originalKey = process.env.BREVO_API_KEY;
  originalSender = process.env.BREVO_SENDER_EMAIL;
  process.env.BREVO_API_KEY = 'test-only-provider-key';
  process.env.BREVO_SENDER_EMAIL = 'verified@example.com';
  calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options, email: JSON.parse(options.body) });
    return Response.json({ messageId: 'test-only-message-id' }, { status: 201 });
  };
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.BREVO_API_KEY; else process.env.BREVO_API_KEY = originalKey;
  if (originalSender === undefined) delete process.env.BREVO_SENDER_EMAIL; else process.env.BREVO_SENDER_EMAIL = originalSender;
});
function request(changes = {}, json = true) {
  return new Request('https://hussein-el-amouri.netlify.app/.netlify/functions/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', origin: 'https://hussein-el-amouri.netlify.app', accept: json ? 'application/json' : 'text/html' },
    body: new URLSearchParams({ 'form-name': 'research-contact', name: 'Researcher', email: 'visitor@example.com', subject: 'Collaboration', message: 'Let us discuss time-series research.', ...changes }),
  });
}
test('sends fixed To/BCC, validated Reply-To, and plain text through Brevo', async () => {
  const response = await contact(request({ to: 'attacker@example.com', bcc: 'attacker@example.com' }));
  assert.equal(response.status, 202);
  assert.equal((await response.json()).accepted, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.brevo.com/v3/smtp/email');
  assert.deepEqual(calls[0].email.to, [{ email: 'alamourihusein@gmail.com' }]);
  assert.deepEqual(calls[0].email.bcc, [{ email: 'h.elamouri@usal.edu.lb' }]);
  assert.equal(calls[0].email.replyTo.email, 'visitor@example.com');
  assert.equal(calls[0].email.sender.email, 'verified@example.com');
  assert.match(calls[0].email.textContent, /time-series research/);
  assert.equal(calls[0].email.htmlContent, undefined);
  assert.equal(config.rateLimit.aggregateBy[0], 'ip');
});
test('missing credentials report unavailable and never contact the provider', async () => {
  delete process.env.BREVO_API_KEY;
  const response = await contact(request());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).accepted, false);
  assert.equal(calls.length, 0);
});
test('invalid inputs and honeypot submissions cannot send email', async () => {
  for (const fields of [{ email: 'bad' }, { subject: '' }, { message: '' }, { subject: 'Hello\r\nBcc: attacker@example.com' }, { website: 'spam' }, { message: 'x'.repeat(10001) }]) {
    assert.equal((await contact(request(fields))).status, 400);
  }
  assert.equal(calls.length, 0);
});
test('unsupported methods and origins are rejected before sending', async () => {
  assert.equal((await contact(new Request('https://example.com', { method: 'GET' }))).status, 405);
  const req = request(); req.headers.set('origin', 'https://unrelated.example');
  assert.equal((await contact(req)).status, 403);
  assert.equal(calls.length, 0);
});
test('provider rejection, network failure, and missing receipt never report success', async () => {
  for (const mock of [async () => new Response('Rejected', { status: 401 }), async () => { throw new Error('Network unavailable'); }, async () => Response.json({})]) {
    globalThis.fetch = mock;
    const response = await contact(request());
    assert.equal(response.status, 502);
    assert.equal((await response.json()).accepted, false);
  }
});
test('successful native form submission redirects after provider acceptance', async () => {
  const response = await contact(request({}, false));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), 'https://hussein-el-amouri.netlify.app/contact/thanks/');
});
