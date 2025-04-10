// routes/shortUrl.js
import express from "express";
import ShortUrl from "../models/Short.model.js";
import generateShortId from "../helper.js";
import client from "../db/redis.js";
import path from "path";
import { fileURLToPath } from "url";
import { rateLimiter } from "../middleware/rateLimiter.js";

// Resolve the directory of the current file
const _fileName = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_fileName);

const router = express.Router();

router.post("/short", rateLimiter, async (req, res) => {
  try {
    let { originalUrl, prefix } = req.body || {};

    if (!originalUrl || !prefix) {
      return res.status(400).send("Missing required fields");
    }

    if (prefix.length > 5) {
      return res.status(400).send("Prefix should be less than 5 characters");
    }

    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,})([\\/\\w.-]*)*\\/?$"
    );

    if (!urlPattern.test(originalUrl)) {
      return res.status(400).send("Invalid URL format");
    }

    let existingShort = await ShortUrl.findOne({ shortCode: prefix });
    while (existingShort) {
      prefix = generateShortId();
      existingShort = await ShortUrl.findOne({ shortCode: prefix });
    }

    const newShort = new ShortUrl({
      originalUrl,
      shortCode: prefix,
    });

    const data = await newShort.save();
    await client.setEx(data.shortCode, 3600, data.originalUrl);

    console.log("✅ Saved:", data);
    res.status(201).json(data);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/short/:code", rateLimiter, async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res
        .status(404)
        .sendFile(path.join(_dirname, "../public", "404.html"));
    }

    const cachedData = await client.get(code);
    if (cachedData) {
      console.log("✅ Cache hit:", cachedData);
      return res.status(301).redirect(cachedData);
    }

    const url = await ShortUrl.findOne({ shortCode: code });

    if (!url) {
      return res
        .status(404)
        .sendFile(path.join(_dirname, "../public", "404.html"));
    }

    await client.setEx(url.shortCode, 3600, url.originalUrl);

    // res.send("hloe");
    res.status(301).redirect(url.originalUrl);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
