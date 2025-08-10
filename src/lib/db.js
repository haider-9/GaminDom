import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return; // Already connected
    }
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamindom');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

export default connectDB;
