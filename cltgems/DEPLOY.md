# CLT Gems — Deploy & develop

**Develop locally or on GitHub. Import to Replit only when you are ready to publish.**  
Do **not** use Replit Agent to regenerate this app — that burns credits and fights the finished codebase.

Site: [https://cltgems.com/](https://cltgems.com/)

---

## 1. Run locally

```bash
cd cltgems   # or unzip cltgems.zip first
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build check:

```bash
npm run build
npm start
```

Requirements: Node.js 20+ recommended.

---

## 2. Push to GitHub

From the project root (after `npm run build` succeeds locally):

```bash
git init
git add .
git commit -m "CLT Gems: Charlotte resource hub + invoice library"
# Create an empty repo on GitHub, then:
git branch -M main
git remote add origin https://github.com/YOUR_USER/cltgems.git
git push -u origin main
```

Keep `.env*` out of git if you add secrets later. This MVP needs no API keys for core pages.

---

## 3. Import once on Replit (publish only)

When the app is ready to host:

1. In Replit: **Import from GitHub** (or upload the zip **excluding** `node_modules` / `.next`).
2. Set the run command to something like: `npm install && npm run build && npm start`  
   (or Replit’s Node/Next template equivalents).
3. Map custom domain `cltgems.com` in Replit / DNS when ready.
4. **Do not** open Replit Agent and ask it to “rebuild CLT Gems from scratch.” Edit small fixes in the editor or locally, commit, pull.

One-shot import → configure run → publish. No iterative AI rebuilds on Replit.

---

## Stack

- Next.js App Router + TypeScript + Tailwind CSS v4
- Invoice Word/PDF engine adapted from AI Bloom Invoice Engine (branded as CLT Gems Docs / Invoice Library)

## Notes

- Directory listings in this MVP are **demo/sample** data.
- Add-business form is a **localStorage + optional mailto** stub — wire a real backend before promising delivery.
- Invoice drafts live in the browser; session wipe is intentional for library PCs.
