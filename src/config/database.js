const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.warn('⚠️  MONGODB_URI not set. Please update your .env file.');
            console.warn('⚠️  Running without database - data will not persist.');
            return;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.warn('⚠️  Running without database - data will not persist.');
        // Don't exit, let the app run for debugging
    }
};

module.exports = connectDB;
