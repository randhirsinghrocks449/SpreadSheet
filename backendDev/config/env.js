import dotenv from 'dotenv';

dotenv.config();
export const {
    PORT,
    MONGO_URI,
    NODE_ENV,
    CRYPTO_KEY,
    JWT_SECRET
} = process.env;