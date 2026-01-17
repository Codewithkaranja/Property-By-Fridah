const express = require('express');
const router = express.Router();
const { addProperty, getProperties, deleteProperty } = require('../Controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // make sure this folder exists
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Routes
router.get('/', getProperties);
router.post('/add', authMiddleware, upload.array('images', 10), addProperty);
router.delete('/:id', authMiddleware, deleteProperty);

module.exports = router;
