import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI!;

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error al conectar con MongoDB:', error);
        process.exit(1); // Finaliza el proceso si hay error
    }
};
