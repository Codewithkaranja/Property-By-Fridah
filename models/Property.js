const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  bedrooms: Number,
  bathrooms: Number,
  parking: Number,
  size: String,
  status: { type: String, default: 'available' },
  description: String,
  images: [String]
}, { timestamps: true }); // ✅ adds createdAt and updatedAt automatically

module.exports = mongoose.model('Property', propertySchema);
