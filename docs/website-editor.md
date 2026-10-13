# Website development and browser editing

For everyday editing, open **https://hussein-el-amouri.netlify.app/admin/** or click **Edit website**. Follow [Browser editing guide](browser-editing.md) for all dashboard controls and the one-time GitHub OAuth setup. You do not need GitHub's file editor for routine changes.

## Contact

Contact is a direct `mailto:alamourihusein@gmail.com` link by default. It opens the visitor's configured mail application. The website does not send email automatically and does not require email-service credentials or a database.

Message boxes are hidden. If you later want a website form, enable **Homepage & career → Enable optional Netlify contact form**. This uses Netlify Forms exclusively. In the existing Netlify project, enable form detection, redeploy, and configure notifications for `research-contact`. Then test a real submission and receipt. The thank-you page is editable under **Archive & thank-you pages**. Netlify Forms configuration is separate from the editor's GitHub OAuth sign-in configuration.

## Deploy to the existing Netlify address

1. Open the existing project for `hussein-el-amouri.netlify.app` in Netlify.
2. Under **Project configuration → Build & deploy → Continuous deployment**, link `hussein88al88amouri/theme-academic-cv` and choose production branch `main`.
3. Use build command `hugo --gc --minify`, publish directory `public`, and an empty base directory. The repository pins Hugo 0.119.0.
4. Save, then trigger a production deploy, clearing the cache if necessary. Confirm the latest commit is published.

GitHub Pages is a secondary build; its deployment does not update Netlify. The browser editor and an optional contact form use the primary Netlify address.

## Developer validation

```bash
export PATH=/workspace/.cloud-tools/bin:/workspace/.cloud-tools/go/bin:$PATH
export GOPATH=/workspace/.cloud-tools/gopath
export GOCACHE=/workspace/.cloud-tools/go-cache
export HUGO_CACHEDIR=/workspace/.cloud-tools/hugo-cache
cd /workspace/theme-academic-cv
hugo --minify --environment production --destination /workspace/.cloud-tools/portfolio-build
hugo server --bind 127.0.0.1 --port 1313 --baseURL http://127.0.0.1:1313/ --disableFastRender
```

Browser checks require Python Playwright and Chromium:

```bash
python3 tests/portfolio_smoke.py --base-url http://127.0.0.1:1313
```

Use `--cms-bundle /path/to/decap-cms.js` with a verified Decap 3.16.3 bundle if CDN access is unavailable. Tests cover content, CV, project diagrams, direct contact, responsive navigation, and the generated OAuth login URL. They do not establish live account authorization or actual Netlify form delivery.

The public site and editor store content in the existing repository. Template demos remain drafts. Conceptual project figures have editable captions/descriptions and can be replaced through the dashboard.
