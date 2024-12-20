const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./src/utils/database');
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/product');
const cartRoutes = require('./src/routes/cart');
const wishlistRoutes = require('./src/routes/wishlist');
const userRoutes = require('./src/routes/user');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ['http://13.233.133.71:5173', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

console.log('came here')
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/user', userRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));