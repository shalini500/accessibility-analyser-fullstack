import React, { useEffect, useState } from "react";

export default function History() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const loadHistory = () => {
      const l = JSON.parse(localStorage.getItem("aa_history") || "[]");
      setList(l);
    };

    // load initially
    loadHistory();

    // listen for storage updates
    window.addEventListener("storage", loadHistory);

    return () => {
      window.removeEventListener("storage", loadHistory);
    };
  }, []);

  const copyJSON = (item) => {
    navigator.clipboard.writeText(
      JSON.stringify(item.raw, null, 2)
    );
    alert("Copied to clipboard");
  };

  const downloadJSON = (item) => {
    const blob = new Blob(
      [JSON.stringify(item.raw, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "accessibility-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card bg-slate-900 p-4 rounded">
      <h3 className="text-lg font-semibold text-teal-300">
        History
      </h3>

      <div className="mt-2 space-y-2">
        {list.length === 0 && (
          <div className="text-slate-400">
            No history yet
          </div>
        )}

        {list.map((item) => (
          <div
            key={item.id}
            className="p-2 bg-slate-800 rounded flex justify-between items-start"
          >
            <div>
              <div className="font-medium text-sm text-white">
                {item.title}
              </div>
              <div className="text-xs text-slate-400">
                {item.summary}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => copyJSON(item)}
                className="px-2 py-1 bg-slate-700 rounded text-xs"
              >
                Copy
              </button>

              <button
                onClick={() => downloadJSON(item)}
                className="px-2 py-1 bg-slate-700 rounded text-xs"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
