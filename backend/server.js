// backend/server.js
console.log("Server starting...");

// Load environment variables
require("dotenv").config({ path: __dirname + "/.env" });

// Debug: check if env variables are loaded
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("PORT:", process.env.PORT);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pinecone } = require("@pinecone-database/pinecone");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB connection (no deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));
// Auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Step 1: Embed user query with Gemini
    const embeddingResponse = await embedModel.embedContent(userMessage);
    const queryEmbedding = embeddingResponse.embedding.values;

    // Step 2: Search Pinecone for relevant hospital docs
    const searchResults = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    const context = searchResults.matches
      .map((m) => m.metadata.text)
      .join("\n");

    // Step 3: Generate answer with Gemini
    const prompt = `
    You are Merkuze, a hospital assistant. Use hospital documents to answer clearly.
    If unsure, recommend contacting a doctor.

    User question: ${userMessage}
    Relevant hospital info: ${context}
    `;

    const result = await chatModel.generateContent(prompt);
    const answer = result.response.text();

    res.json({ answer });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
