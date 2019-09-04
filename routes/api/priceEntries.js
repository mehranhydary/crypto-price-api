const express = require("express");
const router = express.Router();
const PriceEntry = require("../../models/PriceEntry");

// Should get all of the price entries that are in the db
router.get('/', (req, res) => {
    PriceEntry.find({}).sort({$natural:-1}).exec((err, priceEntries) => {
        if(err) 
            return res.status(400).json({err: 'Error getting price entries from db: ' + err});
        return res.status(200).json({ priceEntries })
    })
})

module.exports = router;