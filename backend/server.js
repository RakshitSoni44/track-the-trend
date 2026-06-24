// Day 5: Express Server Setup
// Goal: Initialize a Node.js server that can listen for HTTP requests.

// 1. Import dependencies
const express = require('express');
const dotenv = require('dotenv');

// 2. Load environment variables (we will set this up on Day 6)
dotenv.config();

// Import Database Connection
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// 3. Initialize the Express application
const app = express();

// 4. Middleware
// This built-in middleware allows our server to read JSON data from incoming requests.
app.use(express.json());

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

// 6. Start the Server
// We define a port. It will use the environment variable PORT if it exists, otherwise defaults to 5000.
const PORT = process.env.PORT || 5000;

// app.listen() turns the server on and keeps it running, listening for traffic on the specified port.
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`=================================`);
});