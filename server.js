// DigitalOcean M.A.R.S. — Agent Harness Runtime feature showcase + multimodal
// Serverless Inference demo. Same one-endpoint pattern as the other showcase
// apps, scoped to Harness Runtime only.

import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import { OVERVIEW, FEATURES } from "./features.js";

const MODEL_ACCESS_KEY = process.env.MODEL_ACCESS_KEY;
const TEXT_MODEL = process.env.TEXT_MODEL || "deepseek-4-flash";
const IMAGE_MODEL = process.env.IMAGE_MODEL || "openai-gpt-image-1";
const PORT = process.env.PORT || 8080;
const BASE_URL = "https://inference.do-ai.run/v1";

if (!MODEL_ACCESS_KEY) {
  console.error(
    "Missing MODEL_ACCESS_KEY. Copy .env.example to .env and add your key.\n" +
      "Docs: https://docs.digitalocean.com/products/inference/how-to/manage-model-access-keys/"
  );
  process.exit(1);
}

const client = new OpenAI({ baseURL: BASE_URL, apiKey: MODEL_ACCESS_KEY });

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.static("public"));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/api/config", (_req, res) => {
  res.json({ baseUrl: BASE_URL, textModel: TEXT_MODEL, imageModel: IMAGE_MODEL });
});

app.get("/api/features", (_req, res) => {
  res.json({ overview: OVERVIEW, features: FEATURES });
});

// ---- Text (chat completions) ----
app.post("/api/chat", async (req, res) => {
  const prompt = (req.body?.prompt || "").trim();
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  try {
    const completion = await client.chat.completions.create({
      model: TEXT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant knowledgeable about DigitalOcean's Agent Harness Runtime, " +
            "part of Managed Agents Runtime Services (M.A.R.S.). Be concise.",
        },
        { role: "user", content: prompt },
      ],
      max_completion_tokens: 400,
      temperature: 0.7,
    });
    res.json({
      text: completion.choices[0].message.content,
      model: completion.model,
      usage: completion.usage,
      endpoint: `${BASE_URL}/chat/completions`,
    });
  } catch (err) {
    console.error("chat error:", err.message || err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// ---- Image (images.generate) — same client/base URL/API key as above ----
app.post("/api/image", async (req, res) => {
  const prompt = (req.body?.prompt || "").trim();
  const size = req.body?.size || "1024x1024";
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  try {
    const result = await client.images.generate({
      model: IMAGE_MODEL,
      prompt,
      size,
      n: 1,
    });
    const b64 = result.data[0].b64_json;
    res.json({
      image: `data:image/png;base64,${b64}`,
      model: IMAGE_MODEL,
      usage: result.usage,
      endpoint: `${BASE_URL}/images/generations`,
    });
  } catch (err) {
    console.error("image error:", err.message || err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Agent Harness Runtime Showcase + Inference demo listening on :${PORT}`);
  console.log(`Text model: ${TEXT_MODEL} | Image model: ${IMAGE_MODEL} | Base: ${BASE_URL}`);
});
