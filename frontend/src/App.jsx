// Day 9: Component Skeleton
// Goal: Build a static UI layout using Tailwind CSS.
import React from 'react';

function App() {
  return (
    // The main container for our dashboard.
    // min-h-screen ensures it takes up the full height of the browser.
    // p-8 adds padding all around.
    <div className="min-h-screen p-8 font-sans">
      
      {/* Header Section */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-blue-400 mb-2">
          Micro-Niche Trend Tracker
        </h1>
        <p className="text-slate-400">
          Real-time sentiment analysis for autonomous AI agents.
        </p>
      </header>

      {/* Metrics Grid Skeleton */}
      {/* grid-cols-1 makes it 1 column on mobile, md:grid-cols-3 makes it 3 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-6xl mx-auto">
        
        {/* Metric Card 1 */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-center">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Trends Analyzed</h3>
          <p className="text-3xl font-bold text-white">--</p>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-center">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Average Sentiment</h3>
          <p className="text-3xl font-bold text-green-400">--</p>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-center">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Latest Status</h3>
          <p className="text-3xl font-bold text-blue-400">Connecting...</p>
        </div>

      </div>

      {/* Chart Section Placeholder */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg max-w-6xl mx-auto min-h-[400px] flex items-center justify-center">
        <p className="text-slate-500 italic">Data Chart will render here on Day 11...</p>
      </div>

    </div>
  );
}

export default App;