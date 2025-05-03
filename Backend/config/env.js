import dotenv from 'dotenv';

dotenv.config(); // Load .env only once here

export const {
    PORT,
    MONGO_URI,
    NODE_ENV,
    CRYPTO_KEY,
    JWT_SECRET
} = process.env;