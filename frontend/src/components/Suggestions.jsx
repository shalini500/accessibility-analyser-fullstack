import React from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

export default function Suggestions({ suggestions, ai }) {
  if (!suggestions || suggestions.length === 0) return null;

  const copyFixedHTML = () => {
    if (!ai?.rewrittenHtml) return;
    navigator.clipboard.writeText(ai.rewrittenHtml);
    alert("AI fixed HTML copied!");
  };

  const downloadPDF = () => {
    if (!ai) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Accessibility Analysis Report", 10, 12);

    doc.setFontSize(11);
    doc.text(`Accessibility Score: ${ai.score}/100`, 10, 22);

    doc.setFontSize(12);
    doc.text("AI Summary", 10, 32);
    doc.setFontSize(10);
    doc.text(ai.summary || "N/A", 10, 38, { maxWidth: 180 });

    doc.setFontSize(12);
    doc.text("AI Fix Suggestions", 10, 60);
    doc.setFontSize(9);
    doc.text(
      JSON.stringify(ai.fixes, null, 2).slice(0, 1500),
      10,
      66,
      { maxWidth: 180 }
    );

    doc.save("accessibility-report.pdf");
  };

  return (
    <div className="card bg-slate-900 p-4 rounded">
      {/* RULE-BASED ISSUES */}
      <h3 className="text-lg font-semibold text-teal-300">
        Accessibility Issues
      </h3>

      <div className="mt-3 space-y-2">
        {suggestions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 bg-slate-800 rounded border-l-4 border-teal-400"
          >
            {s}
          </motion.div>
        ))}
      </div>

      {/* AI SECTION */}
      {ai && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-purple-300">
            AI Insights
          </h3>

          {/* SUMMARY */}
          <p className="text-slate-300 mt-2">{ai.summary}</p>

          {/* FIXES */}
          <h4 className="mt-4 font-medium text-purple-200">
            AI Fix Suggestions
          </h4>
          <pre className="mt-2 text-xs bg-black/60 p-3 rounded max-h-40 overflow-auto">
            {JSON.stringify(ai.fixes, null, 2)}
          </pre>

          {/* REWRITTEN HTML */}
          {ai.rewrittenHtml && (
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-purple-200">
                  AI Rewritten HTML
                </h4>
                <button
                  onClick={copyFixedHTML}
                  className="px-3 py-1 text-xs bg-purple-400 text-black rounded font-semibold"
                >
                  Copy HTML
                </button>
                <button
                  onClick={downloadPDF}
                  className="px-3 py-1 text-xs bg-teal-400 text-black rounded font-semibold"
                >
                  Download PDF
                </button>
              </div>

              <pre className="mt-2 text-xs bg-black/60 p-3 rounded max-h-56 overflow-auto">
                {ai.rewrittenHtml}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
