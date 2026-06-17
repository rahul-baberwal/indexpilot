/**
 * IndexPilot — Proxy Server
 * - /proxy/sitemap  → fetches sitemap.xml server-side (avoids browser CORS)
 * - /proxy/indexnow → forwards to api.indexnow.org (avoids browser CORS)
 *
 * Usage:
 *   npm install
 *   node server.js
 *   Open http://localhost:3000
 */

const express = require("express");
const fetch   = require("node-fetch");
const path    = require("path");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

/* ── Sitemap proxy ──────────────────────────────────────────────────────── */
app.post("/proxy/sitemap", async (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith("http")) {
    return res.status(400).json({ error: "Invalid URL" });
  }
  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "IndexPilot-Bot/1.0 (sitemap fetcher)" },
      timeout: 12000,
    });
    if (!resp.ok) return res.status(resp.status).json({ error: `Remote returned ${resp.status}` });
    const xml = await resp.text();
    res.json({ xml });
  } catch (err) {
    res.status(500).json({ error: "Fetch failed: " + err.message });
  }
});

/* ── IndexNow proxy ─────────────────────────────────────────────────────── */
app.post("/proxy/indexnow", async (req, res) => {
  const { host, key, keyLocation, urlList } = req.body;
  if (!host || !key || !Array.isArray(urlList) || !urlList.length) {
    return res.status(400).json({ error: "Missing: host, key, urlList" });
  }
  try {
    const resp = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key, keyLocation, urlList }),
    });
    const status = resp.status;
    const text   = await resp.text().catch(() => "");
    if (status === 200 || status === 202) {
      return res.status(202).json({ success: true, status });
    }
    return res.status(status).json({ error: `IndexNow returned ${status}`, detail: text });
  } catch (err) {
    res.status(500).json({ error: "Proxy error: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀  IndexPilot running → http://localhost:${PORT}\n`);
});
