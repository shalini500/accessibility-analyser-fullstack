import React from 'react'

export default function ScoreMeter({ score }){
  const color = score >= 80 ? 'bg-emerald-400' : score >= 50 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="card bg-slate-900 p-4 rounded">
      <h3 className="text-lg font-semibold text-teal-300">Accessibility Score</h3>
      <div className="mt-3">
        <div className="w-full bg-slate-800 h-4 rounded">
          <div className={`${color} h-4 rounded`} style={{width: `${score}%`}} />
        </div>
        <div className="mt-2 text-slate-300 font-medium">{score}/100</div>
      </div>
    </div>
  )
}
