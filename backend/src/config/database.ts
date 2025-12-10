import moongose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI || '';

if (!mongoURI) {
  throw new Error('MONGO_URI no está definida en .env');
}

export async function connectDB() {
  try {
    await moongose.connect(mongoURI);
    console.log('Conectado a la base de datos MongoDB');
  } catch (error) {
    console.error('Error al conectar a la base de datos MongoDB:', error);
    process.exit(1);
  }
}