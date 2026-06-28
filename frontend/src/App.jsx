// Day 10: State Management & Fetching
import React, { useState, useEffect } from 'react';

function App() {
  // 1. State Variables
  // trends: Holds the array of data from our database
  // isLoading: Tracks whether the network request is still pending
  // error: Holds any error messages if the request fails
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. The Effect Hook (Runs once when the component mounts)
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        // We call our Node.js backend API
        const response = await fetch('http://localhost:5000/api/trends');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }

        // Convert the response to JSON
        const data = await response.json();
        
        // Save the data to our React state
        setTrends(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchTrends();
  }, []); // The empty array [] means "only run this effect ONCE when the page loads"

  // 3. Derived Calculations (Math based on our state)
  const totalTrends = trends.length;
  
  // Calculate average sentiment (ensure we don't divide by zero)
  const avgSentiment = totalTrends > 0 
    ? (trends.reduce((sum, item) => sum + item.sentiment_score, 0) / totalTrends).toFixed(2)
    : 0;

  // 4. The UI (Render)
  return (
    <div className="min-h-screen p-8 font-sans">
      
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-blue-400 mb-2">
          Micro-Niche Trend Tracker
        </h1>
        <p className="text-slate-400">
          Real-time sentiment analysis for autonomous AI agents.
        </p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-6xl mx-auto">
        
        {/* Total Trends Card */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-center transition-all hover:border-blue-500">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Trends Analyzed</h3>
          <p className="text-3xl font-bold text-white">
            {isLoading ? '...' : totalTrends}
          </p>
        </div>

        {/* Average Sentiment Card */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-center transition-all hover:border-green-500">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Average Sentiment</h3>
          <p className={`text-3xl font-bold ${avgSentiment >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {isLoading ? '...' : avgSentiment}
          </p>
        </div>

        {/* System Status Card */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-center transition-all hover:border-purple-500">
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">API Status</h3>
          <p className="text-3xl font-bold text-blue-400">
            {isLoading ? 'Connecting...' : error ? <span className="text-red-500 text-lg">Offline</span> : 'Live'}
          </p>
        </div>

      </div>

      {/* Error Message Display */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-center">
          <strong>Connection Error:</strong> {error}. Is your Node server running on port 5000?
        </div>
      )}

      {/* Chart Section Placeholder (For Day 11) */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg max-w-6xl mx-auto min-h-[400px] flex flex-col items-center justify-center">
        {!isLoading && trends.length > 0 ? (
           <div className="text-center w-full">
              <h3 className="text-xl font-bold text-slate-300 mb-4">Raw Data Fetched Successfully!</h3>
              <p className="text-slate-500 italic mb-4">On Day 11, we will turn this data into a line chart.</p>
              
              {/* Temporary preview of our data */}
              <div className="bg-slate-900 p-4 rounded text-left overflow-y-auto max-h-[250px] text-sm font-mono text-slate-400">
                 {trends.map((item, index) => (
                    <div key={index} className="border-b border-slate-800 py-2">
                       <span className={item.sentiment_score >= 0 ? 'text-green-500' : 'text-red-500'}>
                         [{item.sentiment_score.toFixed(2)}]
                       </span> {item.text}
                    </div>
                 ))}
              </div>
           </div>
        ) : (
          <p className="text-slate-500 italic">Waiting for data...</p>
        )}
      </div>

    </div>
  );
}

export default App;