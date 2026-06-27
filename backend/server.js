// Day 5: Express Server Setup
// Goal: Initialize a Node.js server that can listen for HTTP requests.

// 1. Import dependencies
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// 2. Load environment variables (we will set this up on Day 6)
dotenv.config();

// Import Database Connection
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// 3. Initialize the Express application
const app = express();

// 4. Middleware
// --- DAY 8: ADD CORS MIDDLEWARE ---
// We configure CORS to accept requests from our upcoming Vite React frontend
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  methods: ['GET', 'POST'],
  credentials: true
}));

// This built-in middleware allows our server to read JSON data from incoming requests.
app.use(express.json());

// --- DAY 7: IMPORT ROUTES ---
// We bring in the router file we created today
const trendRoutes = require('./routes/trends');

// 5. Define a Basic Route (Endpoint)
// An HTTP GET request to the root URL ('/') will trigger this function.
app.get('/', (req, res) => {
  res.send('Welcome to the Micro-Niche Trend Tracker API!');
});

// A "Health Check" route is standard industry practice. 
// Cloud providers (like Render) will ping this URL to make sure your server hasn't crashed.
app.get('/health', (req, res) => {
  // We send back a JSON response
  res.json({
    status: "Server is active and healthy!",
    timestamp: new Date().toISOString()
  });
});

// --- DAY 7: USE ROUTES ---
// Any request that goes to '/api/trends' will be handed off to the trendRoutes file!
app.use('/api/trends', trendRoutes);

// 6. Start the Server
// We define a port. It will use the environment variable PORT if it exists, otherwise defaults to 5000.
const PORT = process.env.PORT || 5000;

// app.listen() turns the server on and keeps it running, listening for traffic on the specified port.
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`=================================`);
});