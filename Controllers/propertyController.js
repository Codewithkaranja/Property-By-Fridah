// propertyController.js
const Property = require('../models/Property');
const path = require('path');
const fs = require('fs');

// Base URL for images
const BASE_URL = process.env.BASE_URL || 'https://propertybyfridah.com/uploads/';

// Helper: Convert price string to numeric value (e.g., "7.5m" => 7.5)
function parsePrice(price) {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  return parseFloat(price.toString().replace(/[^\d.]/g, ''));
}

// @desc    Get all properties (frontend-ready)
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });

    const formatted = properties.map(p => ({
      _id: p._id,
      title: p.title,
      location: p.location,
      type: p.type,
      price: p.price.toLocaleString('en-US', { style: 'currency', currency: 'KES' }),
      priceNum: parsePrice(p.price),
      bedrooms: p.bedrooms || 0,
      bathrooms: p.bathrooms || 0,
      parking: p.parking || 0,
      size: p.size || '',
      status: p.status || 'available',
      description: p.description || '',
      images: (p.images || []).map(img => `${BASE_URL}${img}`), // Full URLs
      createdAt: p.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a new property with optional image uploads
// @route   POST /api/properties/add
// @access  Private (Admin)
exports.addProperty = async (req, res) => {
  try {
    const {
      title,
      location,
      type,
      price,
      bedrooms,
      bathrooms,
      parking,
      size,
      status,
      description
    } = req.body;

    if (!title || !location || !type || !price) {
      return res.status(400).json({ message: 'Title, location, type, and price are required' });
    }

    const images = req.files ? req.files.map(file => file.filename) : [];

    const newProperty = new Property({
      title,
      location,
      type,
      price: parsePrice(price),
      bedrooms: bedrooms ? parseInt(bedrooms) : 0,
      bathrooms: bathrooms ? parseInt(bathrooms) : 0,
      parking: parking ? parseInt(parking) : 0,
      size: size || '',
      status: status || 'available',
      description: description || '',
      images
    });

    const savedProperty = await newProperty.save();

    res.status(201).json({ 
      message: 'Property added successfully', 
      property: { 
        ...savedProperty.toObject(), 
        images: savedProperty.images.map(img => `${BASE_URL}${img}`) // Full URLs
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Delete images from server if stored locally
    if (property.images && property.images.length > 0) {
      property.images.forEach(img => {
        const filePath = path.join(__dirname, '../uploads/', img);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    await property.remove();
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
