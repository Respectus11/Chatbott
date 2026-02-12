const express = require("express");
const mongoose = require("mongoose");
const cors = require ("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
// link to mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log("MongoDB connected"))
    .catch(err => console.error(err));
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))

// backend/server.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(bodyParser.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const index = pinecone.Index("hospital-chatbot");

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Step 1: Embed user query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: userMessage,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Step 2: Search Pinecone for relevant hospital docs
    const searchResults = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    const context = searchResults.matches
      .map((m) => m.metadata.text)
      .join("\n");

    // Step 3: Send query + context to GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are Merkuze, a hospital assistant. Use hospital documents to answer clearly. If unsure, recommend contacting a doctor.",
        },
        { role: "user", content: userMessage },
        { role: "assistant", content: `Relevant hospital info:\n${context}` },
      ],
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3001, () => console.log("Backend running on port 3001"));

