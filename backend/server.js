// backend/server.js
console.log("Server starting...");

require("dotenv").config({ path: __dirname + '/.env' });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { pipeline } = require("@xenova/transformers");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("[OK] MongoDB connected"))
  .catch(err => console.error("[ERROR] MongoDB error:", err));

// Auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Chat routes (using Ollama)
const chatRoutes = require("./routes/chat");
app.use("/api/chat", chatRoutes);

// Admin routes (protected - upload documents)
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

// Load Hugging Face models (for embedding if needed)
let embedder;
(async () => {
  try {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("[OK] Multilingual embedding model loaded");
  } catch (err) {
    console.error("[WARNING] Error loading embedding model:", err.message);
  }
})();

// Helper function to get embeddings
async function getEmbedding(text) {
  if (!embedder) throw new Error("Embedder not initialized yet");
  const output = await embedder(text);
  const embeddings = output.tolist()[0]; // token embeddings

  const meanVector = new Array(embeddings[0].length).fill(0);
  embeddings.forEach(tokenVec => {
    tokenVec.forEach((val, i) => {
      meanVector[i] += val;
    });
  });
  return meanVector.map(val => val / embeddings.length);
}

// Test endpoint
app.get("/api/test", async (req, res) => {
  try {
    const sampleText = "እንዴት ነህ? Hello world!";
    if (!embedder) {
      return res.json({ message: "Embedding model not loaded yet" });
    }
    const embedding = await getEmbedding(sampleText);
    res.json({ length: embedding.length, preview: embedding.slice(0, 10) });
  } catch (err) {
    console.error("Embedding test error:", err);
    res.status(500).json({ error: "Embedding not responding" });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`[SERVER] Backend running on port ${PORT}`));
