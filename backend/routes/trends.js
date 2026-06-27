// Day 7: Data Fetching Endpoints
const express = require('express');
const router = express.Router();

// Import our Mongoose model so we can interact with the database
const Trend = require('../models/Trend');

// @route   GET /api/trends
// @desc    Get all recent trending topics and their sentiment scores
router.get('/', async (req, res) => {
  try {
    // 1. Fetch data from MongoDB
    // .find() gets the documents. 
    // .sort({ createdAt: -1 }) orders them by newest first.
    // .limit(50) ensures we only send the 50 most recent records to save bandwidth.
    const trends = await Trend.find()
      .sort({ createdAt: -1 })
      .limit(50);

    // 2. Send the data back as a JSON response
    res.json(trends);
    
  } catch (error) {
    console.error("Error fetching trends:", error);
    // If something breaks, send a 500 (Internal Server Error) status code
    res.status(500).json({ message: "Server Error while fetching trends." });
  }
});

// We export the router so server.js can use it
module.exports = router;