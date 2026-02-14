const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Chat = require("../models/Chat");

const router = express.Router();

// Auth middleware for chat
function authChat(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Please login to use chatbot" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Load hospital data
const hospitalDataPath = path.join(__dirname, "..", "tikur_anbessa_chunk.json");
let hospitalContext = "";

try {
  const data = JSON.parse(fs.readFileSync(hospitalDataPath, "utf8"));
  
  hospitalContext = `
HOSPITAL: ${data.hospital_info.name}
LOCATION: ${data.hospital_info.location}, ${data.hospital_info.address}
PHONE: ${data.hospital_info.contact_numbers.join(", ")}
TYPE: ${data.hospital_info.type}

DEPARTMENTS:
${data.departments_and_services.map(d => `- ${d.department}: ${d.specialties ? d.specialties.join(", ") : d.services ? d.services.join(", ") : ""}`).join("\n")}

DOCTORS:
${data.doctors_and_staff.map(d => `- ${d.name} (${d.department}): ${d.expertise}`).join("\n")}

HOURS: ${data.working_hours.outpatient_departments}
EMERGENCY: ${data.working_hours.emergency_department}

APPOINTMENTS: ${data.appointments.booking_process}

PHARMACY: ${data.pharmacy_information.location}

EMERGENCY CONTACT: ${data.emergency_and_support.emergency_room_phone}
`;
  
  console.log("✅ Hospital data loaded for Ollama");
} catch (err) {
  console.error("Error:", err);
}

// Chat endpoint with Ollama - protected
router.post("/", authChat, async (req, res) => {
  try {
    const userMessage = req.body.message;
    
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Create prompt with hospital context
    const prompt = `<|system|>
You are a friendly AI hospital assistant. Use the hospital information below to answer questions naturally and helpfully. If you don't know something, say so.

${hospitalContext}

<|user|>
${userMessage}

<|assistant|>
`;

    // Call Ollama API (running locally)
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:1b",
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 256
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const result = await response.json();
    let answer = result.response || "";

    // Clean up response
    answer = answer.trim();

    if (!answer || answer.length < 5) {
      answer = "I'm here to help! Please ask me about our hospital services, departments, doctors, or appointments.";
    }

    res.json({ answer });
  } catch (error) {
    console.error("Error in /api/chat:", error.message);
    res.status(500).json({ 
      answer: "Hello! I'm the hospital AI assistant. Ask me anything about our services, departments, doctors, or how to get help!" 
    });
  }
});

// Get chat history
router.get("/history", authChat, async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const chats = await Chat.find({ userId: decoded.id }).sort({ updatedAt: -1 });
    res.json({ chats });
  } catch (err) {
    res.status(500).json({ error: "Failed to get chat history" });
  }
});

// Get specific chat
router.get("/:chatId", authChat, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.json({ chat });
  } catch (err) {
    res.status(500).json({ error: "Failed to get chat" });
  }
});

// Save message to chat
router.post("/:chatId/message", authChat, async (req, res) => {
  try {
    const { role, content } = req.body;
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    
    chat.messages.push({ role, content });
    await chat.save();
    
    res.json({ chat });
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// Start new chat
router.post("/new", authChat, async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const newChat = new Chat({
      userId: decoded.id,
      messages: []
    });
    
    await newChat.save();
    res.json({ chat: newChat });
  } catch (err) {
    res.status(500).json({ error: "Failed to create chat" });
  }
});

module.exports = router;
