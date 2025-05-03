import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { CRYPTO_KEY, JWT_SECRET } from '../config/env.js';

// AES config
const algorithm = 'aes-192-cbc';
const iv = Buffer.alloc(16, 0);

export const encrypt = (text) => {
    try {
        const key = crypto.scryptSync(CRYPTO_KEY, 'salt', 24);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        console.error("Encryption failed:", error);
        throw new Error("Encryption failed");
    }
};
export const decrypt = (encrypted) => {
    try {
        const key = crypto.scryptSync(CRYPTO_KEY, 'salt', 24);
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Decryption failed");
    }
};

export const generateEncryptedToken = (payload, expiresIn = '1h') => {
    try {
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
        return encrypt(token);
    } catch (error) {
        console.error("Token generation failed:", error);
        throw new Error("Token generation failed");
    }
};

export const verifyEncryptedToken = (encryptedToken) => {
    try {
        const decryptedToken = decrypt(encryptedToken);
        console.log("JWT_SECRET", decryptedToken);
        const verify = jwt.verify(decryptedToken, JWT_SECRET);
        console.log("verify", verify);
        return verify;
    } catch (error) {
        console.error("Token verification failed:", error);
        throw new Error("Token verification failed");
    }
};
