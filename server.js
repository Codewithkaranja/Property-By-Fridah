const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const propertiesRoutes = require('./routes/properties'); // must exist
const authRoutes = require('./routes/auth');             // if you have auth
app.use('/api', propertiesRoutes);  // /api/properties
app.use('/api', authRoutes);        // /api/login, /api/register, etc.

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error(err));

// Fallback for frontend routes (optional)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // adjust if needed
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
