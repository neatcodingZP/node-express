import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected, host: ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB connection, error: ${error}`);
    }
}

export default connectDB