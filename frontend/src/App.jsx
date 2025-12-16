import React, {useState} from 'react'
import UploadForm from './components/UploadForm'
import Suggestions from './components/Suggestions'
import ScoreMeter from './components/ScoreMeter'
import History from './components/History'

export default function App(){
  const [analysis, setAnalysis] = useState(null)
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
      <header className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-teal-300">Accessibility Analyser — Pro</h1>
            <p className="text-slate-300 mt-1">Resume-ready, responsive, full-stack project</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <UploadForm setAnalysis={setAnalysis} />
          {analysis && <Suggestions suggestions={analysis.suggestions} />}
        </section>

        <aside className="space-y-4">
          {analysis && <ScoreMeter score={analysis.score} />}
          <History />
        </aside>
      </main>
    </div>
  )
}
