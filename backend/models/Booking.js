const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  package: String,
  people: Number,
  date: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
