const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === "production";

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.use(
  cors({
    origin: isProduction ? process.env.ALLOWED_ORIGINS?.split(",") : true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));

// Serve static files from the dist directory (built frontend)
app.use(
  express.static(path.join(__dirname, "dist"), {
    maxAge: isProduction ? "1y" : 0,
    etag: true,
  }),
);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in the environment.");
  process.exit(1);
}

const ai = new GoogleGenerativeAI(apiKey);
const config = { responseMimeType: "text/plain" };
const model = ai.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: config,
  systemInstruction: "Respond in plain text without any markdown formatting, asterisks, bold, italics, or special characters. Keep responses clean, natural, and easy to read."
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/ask-test-ai", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Missing message" });

  // Rate limiting (basic)
  if (req.headers["x-rate-limit"]) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  try {
    const result = await model.generateContent(message);
    const text = await result.response.text();
    res.json({ text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Serve the React app for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res
    .status(500)
    .json({ error: isProduction ? "Internal server error" : err.message });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`TestApp server listening at http://localhost:${port}`);
    console.log(`Environment: ${isProduction ? "Production" : "Development"}`);
  });
}

module.exports = app;
