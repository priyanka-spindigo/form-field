# Form field samples

Static Astro site with three demo forms (1, 2, and many fields) that POST to **Spindigo Mailer** multipart embed URLs.

Repo: https://github.com/priyanka-spindigo/form-field

## Connect to Mailer (recommended)

From the **spindigo-mailer** repo (creates project + 3 forms + embeds, writes this `.env`):

```bash
cd /path/to/spindigo-mailer
npm run db:seed-form-field
```

Optional env (Mailer `.env`):

- `FORM_FIELD_ORIGINS` — comma/newline origins (default `http://localhost:4321`)
- `MAILER_BASE_URL` or `APP_BASE_URL` — embed URL host (default `http://localhost:3001`)
- `FORM_FIELD_ENV_PATH` — where to write `.env` (default `../form-samples/.env`)
- `AUTH_SMTP_*` — real SMTP for sending (if unset in dev, edit forms in Mailer admin later)

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:4321`. **Mailer API must be running** (`npm run dev:server` or `npm run dev:all` in spindigo-mailer).

| Page | Fields |
|------|--------|
| `/newsletter` | `email` |
| `/quick-contact` | `name`, `email` |
| `/contact` | `name`, `email`, `message`, optional `attachment` |

## Deploy on Render

1. **Static Site** → connect this repo
2. Build: `npm install && npm run build`
3. Publish: `dist`
4. Env (build-time): `PUBLIC_NEWSLETTER_SUBMIT_URL`, `PUBLIC_QUICK_CONTACT_SUBMIT_URL`, `PUBLIC_CONTACT_SUBMIT_URL`
5. Re-run `npm run db:seed-form-field` in Mailer with production `APP_BASE_URL` and add your Render site URL to `FORM_FIELD_ORIGINS`, then redeploy this site.

## Mailer slugs (after seed)

- `newsletter-signup` → `/newsletter`
- `quick-contact` → `/quick-contact`
- `full-contact` → `/contact`

HTML `name=` attributes must match Mailer `{{placeholders}}`.
