import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));

// 🔎 SEARCH route
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ status: false, result: [] });

  try {
    // primary API
    let r = await fetch(`https://my-rest-apis-six.vercel.app/yts?query=${encodeURIComponent(query)}`);
    let data = await r.json();

    // fallback if empty
    if (!data.status || !data.result || data.result.length === 0) {
      r = await fetch(`https://apis-keith.vercel.app/search?q=${encodeURIComponent(query)}`);
      data = await r.json();
    }

    res.json(data);
  } catch (err) {
    res.json({ status: false, error: err.message });
  }
});

// 🎥 DOWNLOAD route with multiple fallbacks
app.get("/api/download", async (req, res) => {
  const { id, url } = req.query;
  const videoUrl = url || `https://youtube.com/watch?v=${id}`;
  if (!videoUrl) return res.json({ status: false, message: "Missing video URL" });

  const endpoints = [
    `https://apis-keith.vercel.app/download?id=${id}&type=mp4`,
    `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}`,
    `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(videoUrl)}&quality=360`,
    `https://www.dark-yasiya-api.site/download?url=${encodeURIComponent(videoUrl)}`
  ];

  for (const apiUrl of endpoints) {
    try {
      const r = await fetch(apiUrl);
      const data = await r.json().catch(() => null);

      if (data && (data.result?.download_url || data.result?.url || data.result?.link)) {
        return res.json({
          status: true,
          download: data.result.download_url || data.result.url || data.result.link
        });
      }
    } catch (err) {
      console.log("❌ Failed endpoint:", apiUrl, err.message);
    }
  }

  res.json({ status: false, message: "Download not available from any API" });
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

