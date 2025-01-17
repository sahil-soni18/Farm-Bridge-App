import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const token = req.headers['access-token']?.split(' ')[1];
    if (token == null) return res.status(401).json({ error: "Access Denied, Token Missing!"});

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token!" });
    }
}

export default authenticateToken;