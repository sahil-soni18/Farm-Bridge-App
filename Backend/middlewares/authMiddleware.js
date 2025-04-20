import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(`Token: ${token}`);

    if (!token) {
        return res.status(401).json({ error: "Access Denied, Token Missing!" });
    }

    try {
        console.log(`Secret: ${process.env.ACCESS_TOKEN_SECRET}`);
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(`Decoded Payload: ${JSON.stringify(decoded)}`);
        const now = Math.floor(Date.now() / 1000);
        console.log(`Token Expiration Time: ${decoded.exp}, Current Time: ${now}`);


        // Use the correct method to find the user by ID
        const user = await User.findByPk(decoded.userId); // Assuming Sequelize
        console.log(`User: ${JSON.stringify(user)}`);

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Attach user info to request
        req.user = { userId: user._id, isFarmer: decoded.isFarmer };
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(401).json({ error: "Invalid Token!" });
    }
};

export default authenticateToken;
