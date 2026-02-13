const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware(), async (req, res) => {
  try {
    const { message } = req.body;
    const answer = `You said: ${message}`; // temporary echo
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
