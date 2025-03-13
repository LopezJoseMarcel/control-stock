import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI!;

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(MONGO_URI);
        
    } catch (error) {
        console.error('Error conectando a MongoDB:', error); // 🔍 Muestra el error en la consola

        process.exit(1); // Finaliza el proceso si hay error
    }
};
