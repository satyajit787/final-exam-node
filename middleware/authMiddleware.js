const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey123';

// Check if user is authenticated via cookie
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Contains id, username, role
        res.locals.currentUser = decoded; // Available in all EJS templates
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

// Check if user has admin role
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access Denied: Admins only');
    }
};

// Middleware to set currentUser in res.locals even for public routes
const checkUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            res.locals.currentUser = decoded;
        } catch (err) {
            res.locals.currentUser = null;
        }
    } else {
        res.locals.currentUser = null;
    }
    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
    checkUser,
    JWT_SECRET
};
