# Editing the research portfolio in your browser

The website includes a Decap CMS dashboard at `/admin/`. It edits the existing GitHub repository and uses Netlify to rebuild the site. You do not need to edit code for routine content updates.

These changes must first be deployed from `hussein88al88amouri/theme-academic-cv` to the existing Netlify site. The cloud environment's Publish action saves the development environment; it does not deploy the website.

## One-time login setup (site owner)

The dashboard uses GitHub authentication through Netlify's OAuth service. It does not depend on Netlify Identity or Git Gateway.

1. In GitHub, open **Settings → Developer settings → OAuth Apps → New OAuth App**. Use the website URL `https://hussein-el-amouri.netlify.app` as the homepage and `https://api.netlify.com/auth/done` as the authorization callback URL.
2. In the existing Netlify site's settings, find the **OAuth / Authentication providers** section (under access/security settings) and install the **GitHub** provider. Enter the OAuth app's client ID and client secret there, securely. Do not put the secret in the repository or send it in chat.
3. Confirm Netlify is connected to this GitHub repository, its production branch is `main`, and automatic builds are enabled. The existing `netlify.toml` pins Hugo Extended-compatible version 0.119.0 and publishes `public/`.
4. Deploy the website changes. Visit `https://hussein-el-amouri.netlify.app/admin/` and choose **Login with GitHub**. Sign in with an account allowed to write to the repository. Public visitors cannot edit content just because they can open `/admin/`.
5. Save a small change as a draft, review it, and publish it through the dashboard. Confirm the corresponding GitHub change and a successful Netlify deployment before considering remote publishing verified.

If login fails, check the Netlify GitHub OAuth provider and callback URL first. If publishing fails, check repository permissions and branch protections. A protected `main` branch may require you to merge the editor's pull request in GitHub. GitHub OAuth credentials belong in Netlify settings; no new environment secret is required for local development.

## What you can edit

| Dashboard section | Content |
| --- | --- |
| Homepage & career | Main headline, introduction, research section introduction, CV PDF, career history, teaching, supervision, contact details, form visibility, Medium profile link |
| Biography & education | Name, role, affiliation, portrait, full biography, research interests, education, tools, social links |
| Research projects | Project title, description, topics, status, links, and full project text |
| Publications | Title, authors, venue, date, publication type, DOI, abstract, PDF/code links, and full text |
| Notes & ideas | Blog posts hosted on this website, or links to essays published on Medium or another website |

**Save** creates an editorial draft rather than updating the public site immediately. Review the entry, mark it ready, and use **Publish** when you want it to go live. Publishing updates GitHub; the public website changes after Netlify finishes its deployment. The **Hide from public site** checkbox is separate: use it only if you want an entry to remain hidden even after it is published to GitHub.

### Updating your CV

Open **Homepage & career**, find **CV PDF**, and upload a replacement PDF or choose one from the media library. Save and publish the change. The `/cv/` route always opens the PDF selected here, so the homepage, navigation, and profile links remain consistent even when the uploaded filename changes.

### Adding publications

Choose **Publications → New**. Add the title, venue, date, type, and known authors. Add a DOI as `10.…` or a full `https://doi.org/…` URL. PDF and code links are optional. If only the publication year is known, enter January 1 of that year for sorting and select **Date accuracy → year**; the public page will show only the year. Keep manuscripts under revision clearly identified as such. Do not label them as accepted or published.

### Writing here and on Medium

For a full post on this website, create a **Notes & ideas** entry and use the main text editor. Leave **Medium / external article URL** empty.

For an essay already on Medium, add its title, date, short description, and full Medium URL. The homepage and notes archive link directly to that essay. An optional Medium profile URL in **Homepage & career** adds a profile link to the homepage. There is no automatic Medium synchronization or import; you control which essays appear.

### Contact messages

The homepage includes a Netlify form named `research-contact`, plus a direct email link. After deployment, confirm the form appears in Netlify's Forms area, enable form handling if required, and configure email notifications there. Test a real submission and confirm receipt. Local tests validate form fields and markup; they cannot establish live Netlify delivery. You can hide the form in the dashboard and keep the email link.

## Developer validation

Use the existing isolated checkout; no worktree is needed. Activate the cloud toolchain:

```bash
export PATH=/workspace/.cloud-tools/bin:/workspace/.cloud-tools/go/bin:$PATH
export GOPATH=/workspace/.cloud-tools/gopath
export GOCACHE=/workspace/.cloud-tools/go-cache
export HUGO_CACHEDIR=/workspace/.cloud-tools/hugo-cache
cd /workspace/theme-academic-cv
hugo --minify --environment production --destination /workspace/.cloud-tools/portfolio-build
hugo server --bind 127.0.0.1 --port 1313 --baseURL http://127.0.0.1:1313/ --disableFastRender
```

Check the homepage, search and year filters, empty search results, mobile menu, keyboard access, reduced motion, `/cv/`, the selected PDF, publication/project pages, `/post/`, and `/admin/`. All publications remain available when JavaScript is disabled. Browser tests of authenticated editing can use Decap's local proxy against a temporary copy of the repository; do not enable that proxy in the deployed CMS configuration.

Template demo posts, projects, talks, slides, and the placeholder author are preserved as drafts. The actual portfolio includes four published papers; the vocoder paper uses 2021 to match its Interspeech 2021 venue and DOI, although the supplied CV lists 2020. Its precise publication month is not asserted.

Browser smoke checks are saved in `tests/portfolio_smoke.py` and require Python Playwright and Chromium. With the development server running:

```bash
python3 tests/portfolio_smoke.py --base-url http://127.0.0.1:1313
```

If CDN access is unavailable in the test environment, provide a verified Decap 3.16.3 bundle with `--cms-bundle /path/to/decap-cms.js`. Screenshots are saved under `/tmp/portfolio-smoke` by default. The CMS login screen is checked; remote GitHub authorization and Netlify publishing require the owner’s one-time setup and a subsequent live test.
