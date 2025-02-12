const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    try {
        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verifiedUser; // Attach user info to request
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;
