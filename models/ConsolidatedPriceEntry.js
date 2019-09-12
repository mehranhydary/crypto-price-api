const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ConsolidatedPriceEntrySchema = new Schema({
  currency: String,
  priceBinance: String,
  priceCoinbasePro: String,
  priceBitstamp: String,
  averagePrice: String,
  date: { type: Date, default: new Date().toLocaleString("en-US", {timeZone: "America/New_York"}) }
});

module.exports = ConsolidatedPriceEntry = mongoose.model("consolidatedPriceEntries", ConsolidatedPriceEntrySchema);
