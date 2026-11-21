# JSRO — Jude Space Research Organisation

Advancing forward since 2014.

The official website of JSRO, hosted on GitHub Pages.

## Put it online (one time)

1. Create a free GitHub account at github.com.
2. Create a **public** repository called `jsro` (click **+** → **New repository**).
3. On the new repository page, click **uploading an existing file**, drag in **everything inside this folder**
   (`index.html`, `app.js`, `data.js`, `config.js`, `README.md`, `.nojekyll` and the `assets` folder), then **Commit changes**.
4. Go to **Settings → Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**,
   **Branch: main**, folder **/ (root)**, and click **Save**.
5. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/jsro/`.

## Turn on Subscribe and Join the crew

Both forms email submissions to you through FormSubmit (free, no sign-up).

1. Open `config.js` on GitHub (pencil icon to edit), replace `YOUR-EMAIL@example.com` with your email, commit.
2. On the live site, submit the Subscribe form once with your own details.
3. FormSubmit emails you an **activation link** — click it. From then on, every subscription and crew
   application arrives in your inbox as a neat table.
4. Optional: FormSubmit's confirmation also gives you a random code. Put that in `config.js` instead of
   your email so your address isn't visible in the page source.

## Everyday updates

| To change… | Edit |
|---|---|
| Sky events, launches, photos | `data.js` — events and launches drop off the page by themselves once their date passes |
| Text, dispatches, sections | `index.html` |
| Where forms are sent | `config.js` |

New dispatch: copy an `<article class="issue">…</article>` block in `index.html`, paste it above Issue 001, and edit it.
Send it to subscribers from your email (or import them into a free mailing service like Brevo or MailerLite).

## Adding a domain later

Buy a domain, then in **Settings → Pages → Custom domain** enter it and add the DNS records GitHub shows you
at your registrar. HTTPS is switched on automatically.

## Credits

Photos: NASA (public domain) and ISRO, credited on each poster and on the page.
JSRO is an independent, unofficial organisation and is not affiliated with ISRO.
