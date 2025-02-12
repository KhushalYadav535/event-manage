const express = require('express'); 
const { check, validationResult } = require('express-validator'); // Import express-validator

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = require('../middleware/authMiddleware');

require('dotenv').config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET;
const BLACKLISTED_TOKENS = new Set(); // Store blacklisted tokens (Optional)


 // 🔹 User Registration Route with validation
router.post('/register', 
    [
        check('username').not().isEmpty().withMessage('Username is required'),
        check('email').isEmail().withMessage('Email is not valid'),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    ], 
    async (req, res) => {
    const { username, email, password } = req.body;

        const errors = validationResult(req); // Validate request
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

 // 🔹 User Login Route with validation
router.post('/login', 
    [
        check('email').isEmail().withMessage('Email is not valid'),
        check('password').not().isEmpty().withMessage('Password is required')
    ], 
    async (req, res) => {
    const { email, password } = req.body;

        const errors = validationResult(req); // Validate request
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

// 🔹 User Logout Route (Optional)
router.post('/logout', authMiddleware, (req, res) => {
    const token = req.header("Authorization");
    if (token) BLACKLISTED_TOKENS.add(token); // Store invalidated token
    res.json({ message: "Logged out successfully" });
});

// 🔹 Token Verification Route
router.get('/verify', authMiddleware, (req, res) => {
    res.json({ message: "Token is valid", user: req.user });
});

module.exports = router;
