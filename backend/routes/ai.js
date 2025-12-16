const express = require("express");
const { spawn } = require("child_process");

const router = express.Router();

router.post("/ai-analyze", (req, res) => {
  const { html, issues } = req.body;

  const prompt = `
You are an accessibility expert.

HTML:
${html}

Detected issues:
${JSON.stringify(issues, null, 2)}

Tasks:
1. Explain issues
2. Suggest fixes
3. Rewrite HTML
4. Give accessibility score (0-100)
5. Give summary

Return JSON ONLY:

{
  "explanations": [],
  "fixes": [],
  "rewrittenHtml": "",
  "score": 0,
  "summary": ""
}
`;

  const ai = spawn("ollama", ["run", "llama3"], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  ai.stdin.write(prompt);
  ai.stdin.end();

  let output = "";

  ai.stdout.on("data", (data) => {
    output += data.toString();
  });

  ai.stderr.on("data", (data) => {
    console.error("AI error:", data.toString());
  });

  ai.on("close", () => {
    try {
      const jsonStart = output.indexOf("{");
      const jsonEnd = output.lastIndexOf("}");
      const jsonText = output.slice(jsonStart, jsonEnd + 1);

      const result = JSON.parse(jsonText);
      res.json({ ai: result });
    } catch (err) {
      console.error("JSON parse failed");
      res.status(500).json({
        error: "Invalid AI JSON",
        raw: output,
      });
    }
  });
});

module.exports = router;
