// Day 12: UI Polish & Features
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

function App() {
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // New state for our button
  const [error, setError] = useState(null);

  // 1. Refactored Fetch Function
  // We can now call this manually via the Refresh Button
  const fetchTrends = async (manualRefresh = false) => {
    if (manualRefresh) setIsRefreshing(true);
    
    try {
      const response = await fetch('https://track-the-trend.onrender.com/api/trends');
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }
      const data = await response.json();
      setTrends(data);
      setError(null); // Clear errors on success
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Run once on load
  useEffect(() => {
    fetchTrends();
  }, []);

  // 2. Metrics & Chart Formatting
  const totalTrends = trends.length;
  const avgSentiment = totalTrends > 0 
    ? (trends.reduce((sum, item) => sum + (item.sentiment_score || 0), 0) / totalTrends).toFixed(2)
    : 0;

  const chartData = [...trends].reverse().map((item, index) => {
    // let safeText = item.original_text || item.text || "Missing text";
    let safeText = item.original_text;
    safeText = String(safeText);
    
    return {
      name: `T-${index + 1}`,
      sentiment: item.sentiment_score || 0,
      fullText: safeText
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl max-w-xs">
          <p className="text-slate-300 text-xs mb-1 font-mono">{payload[0].payload.fullText}</p>
          <p className="font-bold text-blue-400">
            Score: {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  // 3. UI Polish: Sentiment Badge Helper
  // Conditionally applies Tailwind CSS based on the score
  const getSentimentBadge = (score) => {
    if (score >= 0.05) return <span className="bg-green-900/50 text-green-400 text-xs px-3 py-1 rounded-full border border-green-700 font-semibold tracking-wide">POSITIVE</span>;
    if (score <= -0.05) return <span className="bg-red-900/50 text-red-400 text-xs px-3 py-1 rounded-full border border-red-700 font-semibold tracking-wide">NEGATIVE</span>;
    return <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-500 font-semibold tracking-wide">NEUTRAL</span>;
  };

  return (
    <div className="min-h-screen p-8 font-sans bg-slate-900 text-slate-50">
      
      {/* Header with new Refresh Button */}
      <header className="mb-10 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold text-blue-400 mb-2 tracking-tight">
          Micro-Niche Trend Tracker
        </h1>
        <p className="text-slate-400 mb-6 max-w-xl">
          Real-time sentiment analysis for autonomous AI agents. Monitoring Hacker News discussions.
        </p>
        
        <button 
          onClick={() => fetchTrends(true)}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-900/20"
        >
          {isRefreshing ? (
             <>
               <span className="animate-spin text-xl leading-none">↻</span> Refreshing...
             </>
          ) : (
             <>
               <span className="text-xl leading-none">↻</span> Refresh Data
             </>
          )}
        </button>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-6xl mx-auto">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-center transition-all hover:border-blue-500">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Trends Analyzed</h3>
          <p className="text-4xl font-bold text-white">
            {isLoading ? '...' : totalTrends}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-center transition-all hover:border-green-500">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Average Sentiment</h3>
          <p className={`text-4xl font-bold ${avgSentiment >= 0.05 ? 'text-green-400' : avgSentiment <= -0.05 ? 'text-red-400' : 'text-slate-300'}`}>
            {isLoading ? '...' : avgSentiment}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-center transition-all hover:border-purple-500">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">API Status</h3>
          <div className="flex items-center justify-center gap-2 mt-1">
             {isLoading ? (
               <p className="text-3xl font-bold text-slate-400 animate-pulse">Connecting...</p>
             ) : error ? (
               <>
                 <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                 <p className="text-3xl font-bold text-red-500">Offline</p>
               </>
             ) : (
               <>
                 <span className="w-3 h-3 rounded-full bg-green-500"></span>
                 <p className="text-3xl font-bold text-green-400">Live</p>
               </>
             )}
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto mb-6 bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-4 rounded-lg text-center">
          <strong>Connection Error:</strong> {error}
        </div>
      )}

      {/* The Chart Section */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg max-w-6xl mx-auto h-[450px] flex flex-col mb-10">
        <div className="flex justify-between items-center mb-6 px-4">
          <h3 className="text-xl font-bold text-slate-200">Sentiment Timeline</h3>
          <span className="text-xs text-slate-400">Oldest → Newest</span>
        </div>
        
        <div className="flex-grow w-full">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-slate-500 italic animate-pulse">Loading chart data...</p>
            </div>
          ) : trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[-1, 1]} tickCount={5} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '5 5' }} />
                <Line 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#1e293b', stroke: '#3b82f6', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#60a5fa', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-slate-500 italic">No trend data available.</p>
            </div>
          )}
        </div>
      </div>

      {/* NEW FEATURE: Raw Data Log */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg max-w-6xl mx-auto">
        <h3 className="text-xl font-bold text-slate-200 mb-6 px-4">Raw Data Log</h3>
        
        {/* Scrollable Container */}
        <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
             <p className="text-slate-500 italic text-center py-8">Loading records...</p>
          ) : trends.length > 0 ? (
            <div className="flex flex-col gap-3">
              {trends.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 hover:border-slate-500 transition-colors">
                  
                  {/* Left Side: Text and Date */}
                  <div className="flex-grow pr-4 mb-3 md:mb-0">
                    <p className="text-slate-200 font-mono text-sm leading-relaxed">
                      {item.original_text || item.text || "Missing text"}
                    </p>
                    {item.createdAt && (
                      <p className="text-slate-500 text-xs mt-2">
                        Processed: {new Date(item.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  {/* Right Side: Score and Badge */}
                  <div className="flex items-center gap-4 flex-shrink-0 bg-slate-900 p-2 rounded-md border border-slate-800">
                    <span className="font-bold font-mono text-lg text-slate-300 w-16 text-right">
                      {item.sentiment_score ? item.sentiment_score.toFixed(2) : "0.00"}
                    </span>
                    <div className="w-24 text-center">
                       {getSentimentBadge(item.sentiment_score || 0)}
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          ) : (
             <p className="text-slate-500 italic text-center py-8">No recent trends available.</p>
          )}
        </div>
      </div>

    </div>
  );
}

export default App;