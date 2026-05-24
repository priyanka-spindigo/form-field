# Form field samples

Static Astro site with three demo forms (1, 2, and many fields) that POST to **Spindigo Mailer** multipart embed URLs. This repo is separate from the Mailer app.

## Step-by-step (start here)

### Part 1 — Run this site locally

```bash
git clone https://github.com/priyanka-spindigo/form-field.git
cd form-field
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:4321`. Forms will show a config error until you add Mailer embed URLs in `.env` (Part 3).

### Part 2 — Set up Mailer (browser admin)

Use your existing **Spindigo Mailer** app (separate Render service). Sign in to Mailer admin.

1. **Create project:** name it `Form samples`.
2. **Create 3 forms** under that project (SMTP can be the same for all):

| Form name | Suggested slug | Used by page |
|-----------|----------------|--------------|
| Newsletter | `newsletter-signup` | `/newsletter` |
| Quick contact | `quick-contact` | `/quick-contact` |
| Full contact | `full-contact` | `/contact` |

3. For **each form**, set:
   - **Allowed origins** (one per line):
     ```
     http://localhost:4321
     https://form-field.onrender.com
     ```
     (Replace with your real Render URL after deploy.)
   - **Visitor email field keys:** `email`
   - **Team + visitor** email templates (see below)
   - **Static websites (multipart)** → Create embed → copy the **POST URL** (`.../api/public/multipart-mail/mlre_...`)

4. Paste the 3 POST URLs into this repo’s `.env`:

```env
PUBLIC_NEWSLETTER_SUBMIT_URL=https://YOUR-MAILER/api/public/multipart-mail/mlre_...
PUBLIC_QUICK_CONTACT_SUBMIT_URL=https://YOUR-MAILER/api/public/multipart-mail/mlre_...
PUBLIC_CONTACT_SUBMIT_URL=https://YOUR-MAILER/api/public/multipart-mail/mlre_...
```

5. Restart `npm run dev` and test each page.

### Part 3 — Deploy this site on Render

1. Push this repo to GitHub (already: `priyanka-spindigo/form-field`).
2. Render → **New Static Site** → connect `form-field` repo.
3. **Build command:** `npm install && npm run build`
4. **Publish directory:** `dist`
5. Add the same 3 `PUBLIC_*` env vars (build-time).
6. After deploy, copy your site URL (e.g. `https://form-field.onrender.com`).
7. Go back to Mailer → each form → add that URL to **Allowed origins** → save.

### How it works (simple)

1. User fills a form on **this site**.
2. Browser sends data to a **Mailer embed URL** (secret link, no API key in frontend).
3. Mailer checks allowed origins, validates fields, fills email templates (`{{name}}`, `{{email}}`, …).
4. Mailer sends email to **team** and **visitor** via SMTP.
5. Mailer returns success/error JSON → this site shows the message.

---

## Mailer templates & embed JSON

### 1 field — newsletter (`/newsletter`)

HTML fields: `email`, honeypot `botcheck`.

**Team subject:** `New signup: {{email}}`  
**Team body:** `<p>Email: {{email}}</p>`

**Embed JSON:**

```json
{
  "requiredFields": ["email"],
  "stripFieldNames": ["botcheck"],
  "rejectTruthyFields": ["botcheck"]
}
```

Env: `PUBLIC_NEWSLETTER_SUBMIT_URL`

### 2 fields — quick contact (`/quick-contact`)

HTML fields: `name`, `email`, `botcheck`.

**Team subject:** `Contact from {{name}}`  
**Team body:** `<p><strong>Name:</strong> {{name}}</p><p><strong>Email:</strong> {{email}}</p>`

**Embed JSON:**

```json
{
  "requiredFields": ["name", "email"],
  "stripFieldNames": ["botcheck"],
  "rejectTruthyFields": ["botcheck"]
}
```

Env: `PUBLIC_QUICK_CONTACT_SUBMIT_URL`

### Many fields — contact (`/contact`)

HTML fields: `name`, `email`, `message`, optional `attachment`, `botcheck`.

**Team body example:**

```html
<p><strong>Name:</strong> {{name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Message:</strong> {{message}}</p>
```

**Embed JSON:**

```json
{
  "requiredFields": ["name", "email", "message"],
  "fileField": "attachment",
  "requireFile": false,
  "stripFieldNames": ["botcheck"],
  "rejectTruthyFields": ["botcheck"]
}
```

Env: `PUBLIC_CONTACT_SUBMIT_URL`

## Pages

| Path | Fields |
|------|--------|
| `/` | Index |
| `/newsletter` | `email` |
| `/quick-contact` | `name`, `email` |
| `/contact` | `name`, `email`, `message`, `attachment` |

HTML `name=` attributes must match Mailer template placeholders exactly.
