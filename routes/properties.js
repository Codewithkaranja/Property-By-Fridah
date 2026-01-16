const express = require('express');
const router = express.Router();
const { addProperty, getProperties, deleteProperty } = require('/controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getProperties);
router.post('/add', authMiddleware, addProperty);
router.delete('/:id', authMiddleware, deleteProperty);

module.exports = router;
