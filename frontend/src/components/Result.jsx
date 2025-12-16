export default function Result({ data }) {
  if (!data) return null;

  const ai = data.ai || {};
  const score = ai.score || 0;

  const copyHTML = () => {
    navigator.clipboard.writeText(ai.rewrittenHtml || "");
    alert("AI fixed HTML copied!");
  };

  return (
    <div style={{ marginTop: 30 }}>
      {/* SCORE */}
      <h2>Accessibility Score</h2>
      <div
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: score >= 80 ? "green" : score >= 50 ? "orange" : "red",
        }}
      >
        {score} / 100
      </div>

      {/* SUMMARY */}
      <h3>AI Summary</h3>
      <p>{ai.summary}</p>

      {/* FIXES */}
      <h3>AI Fix Suggestions</h3>
      <pre>{JSON.stringify(ai.fixes, null, 2)}</pre>

      {/* FIXED HTML */}
      <h3>AI Rewritten HTML</h3>
      <button onClick={copyHTML}>Copy Fixed HTML</button>
      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 10,
          marginTop: 10,
          maxHeight: 300,
          overflow: "auto",
        }}
      >
        {ai.rewrittenHtml}
      </pre>

      {/* RULE ISSUES */}
      <h3>Rule-based Issues</h3>
      <pre>{JSON.stringify(data.issues, null, 2)}</pre>
    </div>
  );
}
