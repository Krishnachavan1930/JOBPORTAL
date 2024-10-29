// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
    try {
        // Make sure to use MONGODB_URI from the environment variables
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
}

export default connectDB;
