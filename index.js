require('dotenv').config()
const express = require('express')
const cors = require('cors')
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
const request = require('request')
const app = express()
const port = 5000
// For the database
const mongoose = require('mongoose')
const ConsolidatedPriceEntry = require ('./models/ConsolidatedPriceEntry')

// Routes
const priceEntries = require("./routes/api/priceEntries");
const consolidatedPriceEntries = require("./routes/api/consolidatedPriceEntries");
app.use(cors())

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
    .then(() => console.log('Mongo database for api entries successfully connected'))
    .catch(err => console.log(err))

app.get('/binance-eth', (req, res) => {
    request('https://api.binance.com/api/v1/ticker/price?symbol=ETHUSDT', function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        if(error)
            return
        res.status(200).send({
            body
        })
    });
})
app.get('/binance-btc', (req, res) => {
    request('https://api.binance.com/api/v1/ticker/price?symbol=BTCUSDT', function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        if(error)
            return
        res.status(200).send({
            body
        })
    });
})
app.get('/coinbase-pro-eth', (req, res) => {
    request('https://api.pro.coinbase.com/products/ETH-USD/ticker', function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        if(error)
            return
        res.status(200).send({
            body
        })
    });
    
})
app.get('/coinbase-pro-btc', (req, res) => {
    request('https://api.pro.coinbase.com/products/BTC-USD/ticker', function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        if(error)
            return
        res.status(200).send({
            body
        })
    });
})
app.get('/bitstamp-eth', (req, res) => {
    request('https://www.bitstamp.net/api/v2/ticker/ethusd', function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        if(error)
            return
        console.log(body)
        res.status(200).send({
            statusCode: response.statusCode,
            body
        })
    });
})
app.get('/bitstamp-btc', (req, res) => {
    request('https://www.bitstamp.net/api/v2/ticker/btcusd', function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        if(error)
            return
        console.log(body)
        res.status(200).send({
            statusCode: response.statusCode,
            body
        })
    });
})
function averagePrice(price1, price2, price3) {
    if(isNaN(price1)) {
        console.log(1, (price2 + price3) / 2)
        return (price2 + price3) / 2
    } else if(isNaN(price2)) {
        console.log(2, (price1 + price3) / 2)
        return (price1 + price3) / 2
    } else if(isNaN(price3)) {
        console.log(3, (price1 + price2) / 2)
        return (price1 + price2) / 2
    } else if(isNaN(price1) && isNaN(price2)) {
        console.log(4, price3)
        return price3
    } else if(isNaN(price1) && isNaN(price3)) {
        console.log(5, price2)
        return price2
    } else if(isNaN(price2) && isNaN(price3)) {
        console.log(6, price1)
        return price1
    } else if(isNaN(price1) && isNaN(price2) && isNaN(price3)) {
        console.log(7, null)
        return null
    } else {
        console.log(8, (price1 + price2 + price3) / 3)
        return (price1 + price2 + price3) / 3
    }
}
function saveConsolidatedPriceToDatabase(currency, priceBinance, priceCoinbasePro, priceBitstamp) {
    console.log(currency, priceBinance, priceCoinbasePro, priceBitstamp)
    // if(isNaN(priceBinance) || isNaN(priceCoinbasePro) || isNaN(priceBitstamp)){
        // console.log(isNaN(priceBinance), isNaN(priceCoinbasePro), isNaN(priceBitstamp))
        // return 
    // } else {
        console.log('Saving!')
        const newConsolidatedPriceEntry = new ConsolidatedPriceEntry({
            currency, priceBinance, priceCoinbasePro, priceBitstamp, averagePrice: averagePrice(priceBinance, priceCoinbasePro, priceBitstamp)
        });
        newConsolidatedPriceEntry.save()
        .then(priceEntry => console.log(priceEntry))
        .catch(err => console.log(err));
    // }
}
var priceBinanceEth
, priceBinanceBtc
, priceCoinbaseProEth
, priceCoinbaseProBtc
, priceBitstampEth
, priceBitstampBtc

getBinanceEth = () => {
    request('https://api.binance.com/api/v1/ticker/price?symbol=ETHUSDT', function (error, response, body) {
        if(body) {
            if(!isNaN(JSON.parse(body).price))
                priceBinanceEth = parseFloat(JSON.parse(body).price)
            else 
                null
            console.log(priceBinanceEth)
        }
    })
}
getBinanceBtc = () => {
    request('https://api.binance.com/api/v1/ticker/price?symbol=BTCUSDT', function (error, response, body) {
        if(body) {
            if(!isNaN(JSON.parse(body).price))
                priceBinanceBtc = parseFloat(JSON.parse(body).price)
            else 
                null
            console.log(priceBinanceBtc)
        }
    })
}
getCoinbaseProEth = () => {
    request('https://api.pro.coinbase.com/products/ETH-USD/ticker', function (error, response, body) {
        if(body) {
            if(!isNaN(JSON.parse(body).price))
                priceCoinbaseProEth = parseFloat(JSON.parse(body).price)
            else 
                null
            console.log(priceCoinbaseProEth)
        }
    })
}            
getCoinbaseProBtc = () => {
    request('https://api.pro.coinbase.com/products/BTC-USD/ticker', function (error, response, body) {
        if(body) {
            if(!isNaN(JSON.parse(body).price))
                priceCoinbaseProBtc = parseFloat(JSON.parse(body).price)
            else 
                null
            console.log(priceCoinbaseProBtc)
        }
    })
}            
getBitstampEth = () => {
    request('https://www.bitstamp.net/api/v2/ticker/ethusd', function (error, response, body) {
        if(body) {
            if(!isNaN(JSON.parse(body).price))
                priceBitstampEth = parseFloat(JSON.parse(body).last)
            else 
                null
            console.log(priceBitstampEth)
        }
    })
}
getBitstampBtc = () => {
    request('https://www.bitstamp.net/api/v2/ticker/btcusd', function (error, response, body) {
        if(body) {
            if(!isNaN(JSON.parse(body).price))
                priceBitstampBtc = parseFloat(JSON.parse(body).last)
            else 
                null
            console.log(priceBitstampBtc)
        }
    })
}
            

function runOncePerDay() {
    setInterval(() => {
        var date = new Date(); // Create a Date object to find out what time it is
        console.log(date.getHours(), date.getMinutes())
        this.getBinanceEth()
        this.getBinanceBtc()
        this.getCoinbaseProEth()
        this.getCoinbaseProBtc()
        this.getBitstampEth()
        this.getBitstampBtc()
        if(date.getHours() === 9 && date.getMinutes() === 4){ // Check the time
            saveConsolidatedPriceToDatabase('BTC', priceBinanceBtc, priceCoinbaseProBtc, priceBitstampBtc)
            saveConsolidatedPriceToDatabase('ETH', priceBinanceEth, priceCoinbaseProEth, priceBitstampEth)
        } else {
            console.log('Timing does not align at this time.')
        }
    }, 20000)
}

runOncePerDay();
// More routes
app.use('/api/priceEntries', priceEntries);
app.use('/api/consolidatedPriceEntries', consolidatedPriceEntries);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))