const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./db');
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const createPostRoute = require('./routes/post.route');
const createCommentRoute = require('./routes/comment.routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Welcome to my blog');
});
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/post', createPostRoute);
app.use('/api/comment', createCommentRoute);

// Serve static files (for production use)
app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({
    success: false,
    error: true,
    statusCode,
    message,
  });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
