# SMSApp documentation deployment checklist

Use this checklist to publish the corrected Docusaurus site through GitHub Pages. The repository already exists and the deployment workflow is `.github/workflows/deploy-pages.yml`. Do not create a Firebase Hosting project for this documentation site.

## Contents

- [Before publishing](#before-publishing)
- [GitHub Pages and DNS](#github-pages-and-dns)
- [Deploy and verify](#deploy-and-verify)
- [Search discovery](#search-discovery)
- [Rollback](#rollback)

<a id="before-publishing"></a>
## Before publishing&nbsp;[#](#before-publishing)

1. Confirm the private app release tracker says the documented behavior is implemented.
2. Review the public diff and approve it for publication.
3. Run `yarn install --immutable`, `yarn typecheck`, and `yarn build`.
4. Check that package identity, URLs, permissions, recipient limits, and release status match the APK and web admin.
5. Confirm no real contacts, phone numbers, messages, credentials, screenshots, or private source details entered the public repository.

<a id="github-pages-and-dns"></a>
## GitHub Pages and DNS&nbsp;[#](#github-pages-and-dns)

In GitHub repository settings, verify Pages uses **GitHub Actions**, the custom domain is `smsapp-docs.aoneahsan.com`, and HTTPS enforcement is enabled. In the DNS provider, verify the docs subdomain points to `aoneahsan.github.io`. `static/CNAME` must contain the same custom domain.

These are owner-controlled settings. Record the observed values and date; do not infer them from repository files alone.

<a id="deploy-and-verify"></a>
## Deploy and verify&nbsp;[#](#deploy-and-verify)

After owner approval, push the reviewed commit to `main`. The workflow builds and uploads the `build/` artifact to GitHub Pages.

Verify:

- the workflow completed successfully;
- `https://smsapp-docs.aoneahsan.com` serves the reviewed commit;
- `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`, and `/.well-known/security.txt` respond correctly;
- navigation and local search do not expose removed volunteer, multi-device, dual-SIM, international-recipient, or Play-available pages;
- canonical and Open Graph metadata use the docs domain.

Do not run IndexNow before the corrected deployment and sitemap are live.

<a id="search-discovery"></a>
## Search discovery&nbsp;[#](#search-discovery)

After deployment, submit `https://smsapp-docs.aoneahsan.com/sitemap.xml` in the owner's Google Search Console and Bing Webmaster Tools properties. Record the submission result; an HTTP 200 response alone does not prove successful indexing.

Run `yarn indexnow` only after confirming the live sitemap contains the new canonical URLs.

<a id="rollback"></a>
## Rollback&nbsp;[#](#rollback)

If the site is broken or misleading, stop indexing actions and restore the last known-good Git commit through a new corrective commit. Re-run the GitHub Pages workflow, then verify the canonical site. Do not use Firebase Hosting rollback instructions; this site is deployed by GitHub Pages.
