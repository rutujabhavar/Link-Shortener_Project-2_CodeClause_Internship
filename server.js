const express = require("express");
const path = require("path");
const qr = require("qrcode");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const links = {}; // { code: { url, clicks } }

// CREATE SHORT URL
app.post("/api/shorten", async (req, res) => {
  const { url, customCode } = req.body;

  if (!url) return res.status(400).json({ message: "URL is required" });

  const code = customCode || Math.random().toString(36).substring(2, 7);

  if (links[code]) return res.status(400).json({ message: "Code already exists" });

  links[code] = { url, clicks: 0 };

  const qrCode = await qr.toDataURL(`http://localhost:5000/${code}`);

  res.json({
    shortUrl: `http://localhost:5000/${code}`,
    qrCode
  });
});

// REDIRECT
app.get("/:code", (req, res) => {
  const code = req.params.code;

  if (!links[code]) return res.status(404).send("Link not found");

  links[code].clicks++;
  res.redirect(links[code].url);
});

// GET ANALYTICS
app.get("/api/stats/:code", (req, res) => {
  const code = req.params.code;

  if (!links[code]) return res.status(404).json({ message: "No data" });

  res.json({
    url: links[code].url,
    clicks: links[code].clicks
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
