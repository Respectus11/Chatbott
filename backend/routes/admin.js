const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("@xenova/transformers");

const router = express.Router();

// Auth middleware
function authAdmin(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Please login" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified.role !== "admin") {
      return res.status(403).json({ error: "Admin only" });
    }
    req.user = verified;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// File upload config
const upload = multer({ dest: "uploads/" });

// Simple document storage (in memory for now - use MongoDB in production)
let documents = [];

// Get all documents
router.get("/documents", authAdmin, (req, res) => {
  res.json({ documents });
});

// Upload document
router.post("/upload", authAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read file content
    const filePath = req.file.path;
    let text = "";

    if (req.file.mimetype === "text/plain") {
      text = fs.readFileSync(filePath, "utf8");
    } else {
      // For PDF/DOC, just store filename for now
      text = `Document: ${req.file.originalname}`;
    }

    // Create embedding (simple approach - in production use Pinecone)
    const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const embedding = await embedder(text);
    
    const doc = {
      _id: "doc_" + Date.now(),
      filename: req.file.originalname,
      content: text.substring(0, 1000), // Store first 1000 chars
      createdAt: new Date(),
    };

    documents.push(doc);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({ success: true, document: doc });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Delete document
router.delete("/documents/:id", authAdmin, (req, res) => {
  const id = req.params.id;
  documents = documents.filter(d => d._id !== id);
  res.json({ success: true });
});

module.exports = router;
