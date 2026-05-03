const mongoose = require('mongoose');
require('dotenv').config({ path: './frontend/.env' });

async function checkDB() {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected! Checking collections...");
    
    const db = mongoose.connection.db;
    const questions = await db.collection('questions').countDocuments();
    const syllabuses = await db.collection('syllabuses').countDocuments();
    
    console.log(`Questions in DB: ${questions}`);
    console.log(`Syllabuses in DB: ${syllabuses}`);
    
    process.exit(0);
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
}

checkDB();
