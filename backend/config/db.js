// Day 6: Database Connection Configuration
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We use async/await because connecting to a cloud database takes time.
    // process.env.MONGO_URI pulls your connection string from the .env file.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit the Node process with failure code (1) if the connection fails
    process.exit(1);
  }
};

module.exports = connectDB;