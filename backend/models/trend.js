// Day 6: Mongoose Schema
const mongoose = require('mongoose');

// We define a Schema that perfectly matches the dictionary our Python script created on Day 2.
const trendSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sentiment_score: {
    type: Number,
    required: true,
  },
  sentiment_label: {
    type: String,
    required: true,
  },
  // We can add a timestamp so we know exactly when Node.js read/processed this record
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// We compile the schema into a model. 
// Note: Mongoose automatically looks for the lowercase, plural version of this string.
// So "Trend" will automatically look for the "trends" collection we made in Python!
// If your Python collection is named exactly "daily_trends", we specify it as the third argument to be safe:
const Trend = mongoose.model('Trend', trendSchema, 'daily_trends');

module.exports = Trend;