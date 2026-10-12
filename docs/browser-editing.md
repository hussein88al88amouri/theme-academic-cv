# Edit your website directly in the browser

Open **https://hussein-el-amouri.netlify.app/admin/** or click **Edit website** in the footer. Homepage, publication, project, author, and article pages also have **Edit this page** shortcuts.

Sign in with **Login with GitHub**. GitHub stores changes behind the scenes; you do not need to visit its file editor. Only accounts with repository write permission can publish changes.

## What to open in the dashboard

| Section | What you can change |
| --- | --- |
| **Homepage & career** | Headline, descriptions, section headings, experience, teaching, supervision, navigation, button text, contact labels/messages, Medium/LinkedIn writing links, CV, portrait shape/caption, colors and homepage text sizes |
| **Homepage & career → All headings, buttons, labels and messages** | The remaining common copy across the homepage, article pages, navigation, and footer |
| **Biography & education** | Name, role, affiliation, research interests, biography, education, skills, social links, profile picture |
| **Publications** | Add/edit articles, title, authors, journal/conference, abstract, date, DOI, PDF/code links, tags, full text |
| **Research projects** | Add/edit projects, description, status, full text, links, conceptual figure, figure caption, accessible image description |
| **Notes & ideas** | Add/edit full blog posts or links to Medium/external essays |
| **Additional pages** | Create new text pages with a title, description, and rich text; then add `/page/<slug>/` to your navigation if desired |
| **Archive & thank-you pages** | Archive page titles and introductory text, and the contact thank-you message |
| **Media** | Upload and manage photos, PDFs, and other content assets |

To replace your portrait, open **Biography & education → Portrait photo**, upload/select an image, save, and publish. To edit research interests, add/remove/reorder entries under **Interests** in the same section.

To add an article, open **Publications → New**, complete the fields, and use the rich-text/Markdown editor. For a blog post, use **Notes & ideas → New** instead.

**Save** makes a draft. Review it, mark it ready, then use **Publish**. Netlify rebuilds the public website after publication; updates are not instant. The **Hide from public site** checkbox keeps an entry hidden even if its underlying change has been published.

The dashboard edits registered content and assets. Application code, email credentials, and Netlify deployment/account settings are configured separately. Existing SVG diagram labels are part of an image; replace the figure to change the drawing, or edit its caption/description directly.

## One-time sign-in setup

If **Login with GitHub** fails, the Netlify OAuth provider has not yet been configured:

1. In your GitHub account, go to **Settings → Developer settings → OAuth Apps → New OAuth App**. Set the homepage URL to `https://hussein-el-amouri.netlify.app` and callback URL to `https://api.netlify.com/auth/done`.
2. In your existing Netlify project's configuration, find **OAuth / Authentication providers** under its access/security settings and install the **GitHub** provider.
3. Enter the OAuth app's client ID and secret securely in that Netlify settings panel. Never put the secret in chat, source code, or the CMS.
4. Confirm the project is connected to `hussein88al88amouri/theme-academic-cv`, production branch `main`, then deploy the latest version.
5. Open `/admin/`, sign in with your repository-owner GitHub account, save a small draft, publish, and confirm Netlify's deploy succeeds.

This one-time setup requires the site owner's accounts. The repository's Git proxy access does not configure Netlify login automatically. No database is needed for browser content editing.
