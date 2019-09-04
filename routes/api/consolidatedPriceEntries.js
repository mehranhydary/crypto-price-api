const express = require("express");
const router = express.Router();
const ConsolidatedPriceEntry = require("../../models/ConsolidatedPriceEntry");

// Should get all of the price entries that are in the db
router.get('/', (req, res) => {
    ConsolidatedPriceEntry.find({}).sort({$natural:-1}).exec((err, consolidatedPriceEntries) => {
        if(err) 
            return res.status(400).json({err: 'Error getting consolidated price entries from db: ' + err});
        return res.status(200).json({ consolidatedPriceEntries })
    })
})

module.exports = router;