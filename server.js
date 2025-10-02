import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));

// 🔎 Search route
app.get("/api/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json({ status: false, result: [] });

  try {
    const r = await fetch(`https://apis-keith.vercel.app/search?q=${encodeURIComponent(q)}`);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.json({ status: false, error: err.message });
  }
});

// 🎥 Video download route
app.get("/api/download", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.json({ status: false, message: "Missing video ID" });

  try {
    const r = await fetch(`https://apis-keith.vercel.app/download?id=${id}&type=mp4`);
    const data = await r.json();

    if (data.status && data.result && data.result.download_url) {
      res.json({ status: true, download: data.result.download_url });
    } else {
      res.json({ status: false, message: "Download not available" });
    }
  } catch (err) {
    res.json({ status: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Video Downloader running at http://localhost:${PORT}`));
