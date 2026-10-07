const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import routes & middleware
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { checkUser } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/task_management_db';

// Database Connection with fallback
async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
        console.log('Connected to Local MongoDB Successfully');
    } catch (err) {
        console.log('Local MongoDB not running. Starting embedded in-memory MongoDB...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log('Connected to Embedded MongoDB Successfully at', uri);
        } catch (memoryErr) {
            console.error('Failed to connect to MongoDB:', memoryErr);
        }
    }
}

connectDB();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Apply checkUser middleware to all routes to make currentUser available in navbar
app.use(checkUser);

// Routes
app.use('/', authRoutes);
app.use('/tasks', taskRoutes);

// Root route
app.get('/', (req, res) => {
    res.redirect('/tasks');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
