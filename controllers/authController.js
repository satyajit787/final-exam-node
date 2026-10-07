const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Render Register Page
exports.getRegister = (req, res) => {
    res.render('register', { error: null });
};

// Handle Register POST
exports.postRegister = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('register', { error: 'Username already taken.' });
        }

        // Create new user (role default is 'user' if not specified)
        const user = new User({
            username,
            password,
            role: role === 'admin' ? 'admin' : 'user'
        });

        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('register', { error: 'Registration failed. Please try again.' });
    }
};

// Render Login Page
exports.getLogin = (req, res) => {
    res.render('login', { error: null });
};

// Handle Login POST
exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('login', { error: 'Invalid username or password.' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid username or password.' });
        }

        // Generate JWT Token with role in payload
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Store JWT in HTTP-only Cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Login failed. Please try again.' });
    }
};

// Handle Logout
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};
