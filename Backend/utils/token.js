import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const generateToken = (userId, isFarmer) => {
    const payload = { userId, isFarmer };
    console.log(`Access Token Secret in Token.js: ${process.env.ACCESS_TOKEN_SECRET}`);
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}