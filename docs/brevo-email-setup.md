# Enable automatic contact email with BCC

The contact form now submits to a Netlify server function. The server sends a transactional email through Brevo:

- **To:** `alamourihusein@gmail.com`
- **BCC:** `h.elamouri@usal.edu.lb`
- **Reply-To:** the visitor's validated email address

The recipient addresses are fixed server-side; visitors cannot change them. No database is required. The Brevo API key stays in Netlify's server environment and never enters the browser, dashboard, repository, or page HTML.

## One-time setup

1. Create or sign in to your [Brevo account](https://www.brevo.com/). Ensure transactional email sending is enabled for your account.
2. In Brevo's sender settings, add a sender email address you control and complete its verification. If you use a custom sending domain, complete the domain authentication steps Brevo provides. Use a sender that Brevo permits; the visitor's email is **Reply-To**, not the sender.
3. In Brevo's API-key settings, create an API key for sending transactional messages. This is an **API key**, not an SMTP password.
4. Open the existing Netlify project for `hussein-el-amouri.netlify.app`. Under **Project configuration → Environment variables**, add:

   | Name | Value |
   | --- | --- |
   | `BREVO_API_KEY` | Your Brevo API key, entered securely |
   | `BREVO_SENDER_EMAIL` | The verified sender email from step 2 |

   Make these variables available to the production **Functions** runtime. Do not put the key in chat, source files, or the browser editor.
5. Confirm Netlify is connected to `hussein88al88amouri/theme-academic-cv`, branch `main`. Deploy the latest commit. The repository configures `netlify/functions` and Node 22; no npm dependencies are required by the email handler.
6. In Netlify's Functions view, confirm the `contact` function has deployed.
7. Submit a short test message through the live site's contact form. Confirm its status in Brevo's transactional logs, receipt at Gmail, and receipt of the BCC at your USAL address. Replying to that email should address the visitor.

This replaces the Netlify Forms notification mechanism. You do not need a Netlify Forms notification to send these emails. Disable any old notifications that would create duplicate emails. The browser dashboard's **Contact form submission URL** must remain:

`https://hussein-el-amouri.netlify.app/.netlify/functions/contact`

## Troubleshooting

- **503 / email not configured:** the API key or verified sender is missing from the deployed function's environment. Correct the variables and redeploy.
- **502 / delivery not accepted:** check Brevo for sender verification, account activation, API-key validity, sending quota, or temporary service issues. The form retains the visitor's text and does not report success.
- **429:** too many attempts; wait before retrying. The function includes a Netlify per-IP rate limit of five requests per minute, subject to the platform's rate-limit feature availability.
- **Accepted but not received:** inspect Brevo's delivery logs and spam folders. Provider acceptance does not prove final delivery to either mailbox.
- **GitHub Pages:** the static preview cannot run this function. Its form submits normally to the primary Netlify site's function and redirects to the thank-you page only after Brevo accepts the message.

The endpoint also validates form fields, limits message length, rejects the honeypot field, and accepts browser origins only from the primary website and GitHub Pages host. Automated tests mock Brevo; they send no real email and do not establish live delivery.

## Local checks

```bash
node --test tests/contact.test.mjs
```

Run the browser smoke checks described in `docs/website-editor.md` after building the site. To test real delivery, configure the deployed Netlify function and use the live form.
