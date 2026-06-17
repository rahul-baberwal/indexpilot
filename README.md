# IndexPilot v2

One-click Google Indexing API + Bing IndexNow submission tool with multi-profile, multi-site support, submission history, and sitemap auto-fetch.

## Quick Start

```bash
npm install
npm start
# Open http://localhost:3000
```

---

## Features

- **Profiles** — group multiple websites under named profiles (e.g. "My Agency", "Personal")
- **Multi-site** — add unlimited sites, each with their own Google + Bing keys
- **Sitemap auto-fetch** — server fetches your sitemap.xml to avoid browser CORS; falls back to manual paste
- **Bing CORS fix** — IndexNow requests proxied through local server
- **Submission history** — every request saved to localStorage, grouped by day with timestamps
- **localStorage persistence** — profiles, sites, keys, and history all saved locally; no database needed
- **Premium dark UI** — Syne + DM Sans typography, gradient accents, grain overlay

---

## Google Indexing API — one-time setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Web Search Indexing API**
3. **IAM & Admin → Service Accounts → Create** → download JSON key
4. Open [Search Console](https://search.google.com/search-console/) → Settings → Users & Permissions
5. Add the service account email as **Owner**
6. Paste the full JSON into the site's Google key field in IndexPilot

---

## Bing IndexNow — one-time setup

1. Go to [bing.com/indexnow](https://www.bing.com/indexnow) and generate a key
2. Upload the `.txt` key file to your site root: `https://yourdomain.com/{key}.txt`
3. Paste the key into the site's Bing key field in IndexPilot

> IndexNow also notifies Yandex, Naver, and other participating engines automatically.

---

## Project structure

```
indexer-v2/
├── server.js          # Express proxy (sitemap fetch + Bing IndexNow)
├── package.json
├── README.md
└── public/
    └── index.html     # Full app (HTML + CSS + JS, no framework)
```

---

## Data storage

Everything is stored in your browser's `localStorage`:

| Key | Contents |
|-----|----------|
| `ip_profiles` | Profile list (id, name, emoji) |
| `ip_sites` | Site list (url, label, googleKey JSON, bingKey) |
| `ip_history` | Submission log (up to 2000 entries) |
| `ip_active` | Currently active site id |

Keys are stored as-is in localStorage. For production use, consider encrypting them or using a secrets manager.

---

## Deploying for a team

```bash
# PM2
npm install -g pm2
pm2 start server.js --name indexpilot
pm2 save

# Or set a custom port
PORT=8080 node server.js
```

Each team member's browser has their own localStorage, so profiles/keys are per-user.
