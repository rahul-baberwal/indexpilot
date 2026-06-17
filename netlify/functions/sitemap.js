const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const { url } = JSON.parse(event.body);
    if (!url || !url.startsWith("http")) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid URL" })
      };
    }

    const resp = await fetch(url, {
      headers: { "User-Agent": "IndexPilot-Bot/1.0 (sitemap fetcher)" },
      timeout: 12000,
    });

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Remote returned ${resp.status}` })
      };
    }

    const xml = await resp.text();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xml })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Fetch failed: " + err.message })
    };
  }
};
