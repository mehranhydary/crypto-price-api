const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PriceEntrySchema = new Schema({
  currency: String,
  price: String,
  source: String,
  date: { type: Date, default: Date.now() }
});

module.exports = PriceEntry = mongoose.model("priceEntries", PriceEntrySchema);
