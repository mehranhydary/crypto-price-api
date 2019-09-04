const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ConsolidatedPriceEntrySchema = new Schema({
  currency: String,
  priceBinance: String,
  priceCoinbasePro: String,
  priceBitstamp: String,
  averagePrice: String,
  date: { type: Date, default: Date.now() }
});

module.exports = ConsolidatedPriceEntry = mongoose.model("consolidatedPriceEntries", ConsolidatedPriceEntrySchema);
