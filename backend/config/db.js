const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinereview';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(` MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.error(` MongoDB Connection Error: ${error.message}`);
    console.warn(` Please ensure your MONGODB_URI is properly set in backend/.env (e.g. your MongoDB Atlas cluster URI).`);
  }
};

const getDBStatus = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

module.exports = { connectDB, getDBStatus };
