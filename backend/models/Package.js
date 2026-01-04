const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  imageUrl: { type: String }
});

module.exports = mongoose.model("Package", packageSchema);
