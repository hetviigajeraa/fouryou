const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Assuming you use JWT for authentication
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock user data (replace with your database logic)
const users = {
    'john.doe@example.com': {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 98765 43210',
        orders: [
            { id: '#12345', product: 'Hydrating Face Cream', amount: '₹1,850.00', status: 'Delivered' },
            { id: '#12346', product: 'Gentle Exfoliating Scrub', amount: '₹1,200.00', status: 'Pending' },
            { id: '#12347', product: 'Soothing Aloe Vera Gel', amount: '₹750.00', status: 'Cancelled' }
        ]
    }
};

// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// API endpoint to get user data
app.get('/api/user', authenticateToken, (req, res) => {
    const userEmail = req.user.email; // Assuming the email is stored in the token
    const userData = users[userEmail];
    if (userData) {
        res.json(userData);
    } else {
        res.status(404).json({ message: 'User  not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});