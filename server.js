// server.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

// Simple proxy endpoint
app.get("/proxy", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  try {
    // Fetch the target website
    const response = await fetch(url);
    let body = await response.text();

    // Remove headers that prevent iframe embedding
    res.set("X-Frame-Options", "ALLOWALL");
    res.set("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval'");

    // Optionally rewrite relative URLs in HTML (basic)
    body = body.replace(/src="\/(.*?)"/g, `src="${url}/$1"`);
    body = body.replace(/href="\/(.*?)"/g, `href="${url}/$1"`);

    res.send(body);
  } catch (err) {
    res.status(500).send("Error fetching URL: " + err.message);
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Proxy is running!");
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
