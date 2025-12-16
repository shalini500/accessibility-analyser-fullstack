// backend/routes/analyze-and-ai.js
const express = require("express");
const fetch = require("node-fetch"); // install: npm i node-fetch@2 if needed
const path = require("path");

const router = express.Router();

// Require your existing analyze logic.
// Adjust path to your analyze.js — this assumes it exports a function analyzeHTML(html) that returns issues array.
const analyzePath = path.join(__dirname, "analyze.js"); // if analyze.js is in same folder, else adjust
let analyze;
try {
  analyze = require("./analyze"); // if analyze exports a function
} catch (e) {
  // If your analyze.js exports differently, adapt accordingly.
  console.warn("Could not require ./analyze - make sure analyze.js exports a function analyzeHTML(html).", e);
}

/**
 * POST /api/analyze-and-ai
 * body: { html: string, askAI?: boolean, aiMode?: "explain"|"fix"|"score" }
 */
router.post("/analyze-and-ai", async (req, res) => {
  try {
    const { html = "", askAI = true, aiMode = "explain" } = req.body;

    // 1) Run rule-based analyzer (existing)
    let issues = [];
    if (analyze && typeof analyze === "function") {
      issues = await analyze(html); // your analyze should return an array of issue objects
    } else {
      // fallback: minimal placeholder
      issues = [{ issue: "analyzer-not-found", detail: "Local analyzer not available" }];
    }

    const responsePayload = { issues };

    if (!askAI) {
      return res.json(responsePayload);
    }

    // 2) Call local AI endpoint (internal)
    const aiRes = await fetch("http://localhost:5000/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, issues, mode: aiMode }),
    });

    const aiJson = await aiRes.json();
    responsePayload.ai = aiJson.ai;

    return res.json(responsePayload);
  } catch (err) {
    console.error("analyze-and-ai error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
