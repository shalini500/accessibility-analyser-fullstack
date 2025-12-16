const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const analyzeRoute = require("./routes/analyze");
const aiRoute = require("./routes/ai"); // ⬅ NEW AI ROUTE

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// Rule-based analyzer
app.use("/api/analyze", analyzeRoute);

// AI analyzer (LLaMA3 via Ollama)
app.use("/api/ai", aiRoute);

// Simple health endpoint
app.get("/api/health", (req, res) => {
  res.json({ ok: true, ai: true });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
