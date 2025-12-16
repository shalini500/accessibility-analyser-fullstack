import React, { useState } from "react";
import axios from "axios";

export default function UploadForm({ setAnalysis }) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!html.trim()) {
      alert("Please paste or upload HTML first");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Rule-based accessibility analysis
      const ruleRes = await axios.post(
        "http://localhost:5000/api/analyze",
        { html }
      );

      // 2️⃣ AI accessibility analysis (local Ollama)
      const aiRes = await axios.post(
        "http://localhost:5000/api/ai/ai-analyze",
        {
          html,
          issues: ruleRes.data.suggestions,
        }
      );

      // 3️⃣ Merge results for UI
      const finalResult = {
        suggestions: ruleRes.data.suggestions,
        score: aiRes.data.ai.score,
        ai: aiRes.data.ai,
      };

      setAnalysis(finalResult);

      // 4️⃣ Save to history (localStorage)
      const history = JSON.parse(
        localStorage.getItem("aa_history") || "[]"
      );

      history.unshift({
        id: Date.now(),
        title: "Accessibility Analysis",
        summary:
          aiRes.data.ai.summary ||
          `${ruleRes.data.suggestions.length} issues found`,
        raw: finalResult,
      });

      localStorage.setItem(
        "aa_history",
        JSON.stringify(history.slice(0, 50))
      );
    } catch (err) {
      console.error(err);
      alert("Error analyzing. Is backend & Ollama running?");
    } finally {
      setLoading(false);
    }
  };

  const onFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setHtml(reader.result);
    reader.readAsText(file);
  };

  return (
    <div className="card bg-slate-900 p-4 rounded">
      <h2 className="text-xl font-semibold text-teal-300">
        Analyze HTML
      </h2>

      <p className="text-slate-400">
        Paste HTML or upload an .html file. Analysis runs
        locally with AI (no paid APIs).
      </p>

      <form onSubmit={submit} className="mt-3">
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          className="w-full h-48 p-2 bg-slate-800 rounded text-white"
          placeholder="Paste HTML here..."
        />

        <div className="flex gap-2 mt-3">
          <input
            type="file"
            accept=".html"
            onChange={onFile}
            className="px-3 py-2 bg-slate-700 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-teal-400 text-slate-900 rounded font-semibold"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          <button
            type="button"
            onClick={() => {
              setHtml("");
              setAnalysis(null);
            }}
            className="px-3 py-2 bg-slate-700 rounded"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
