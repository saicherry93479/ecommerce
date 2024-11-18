// src/utils/database.js or similar file
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    await mongoose.connect(mongoURI, options);
    console.log('MongoDB connected successfully');
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;