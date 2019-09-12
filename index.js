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

// Cors 
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
        res.status(200).send({
            statusCode: response.statusCode,
            body
        })
    });
})
function averagePrice(price1, price2, price3) {
    if(isNaN(price1)) {
        return (price2 + price3) / 2
    } else if(isNaN(price2)) {
        return (price1 + price3) / 2
    } else if(isNaN(price3)) {
        return (price1 + price2) / 2
    } else if(isNaN(price1) && isNaN(price2)) {
        return price3
    } else if(isNaN(price1) && isNaN(price3)) {
        return price2
    } else if(isNaN(price2) && isNaN(price3)) {
        return price1
    } else if(isNaN(price1) && isNaN(price2) && isNaN(price3)) {
        return null
    } else {
        return (price1 + price2 + price3) / 3
    }
}
function saveConsolidatedPriceToDatabase(currency, priceBinance, priceCoinbasePro, priceBitstamp) {
        console.log('Saving!')
        console.log(new Date().toISOString().split("T")[0])
        ConsolidatedPriceEntry.find({date: new Date().toISOString().split("T")[0]})
        .then(response => {
            // console.log(response)
            if (response.length === 0){
                console.log('Saving price for the day')
                const newConsolidatedPriceEntry = new ConsolidatedPriceEntry({
                    date: new Date().toISOString().split("T")[0], currency, priceBinance, priceCoinbasePro, priceBitstamp, averagePrice: averagePrice(priceBinance, priceCoinbasePro, priceBitstamp)
                });
                newConsolidatedPriceEntry.save()
                // .then(priceEntry => console.log(priceEntry))
                // .catch(err => console.log(err));
            } else {
                console.log('Value for today already in db!')
            }
        })
        .catch(err => {
            console.log(err)
        })
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
                getBinanceEth()
        }
    })
}
getBinanceBtc = () => {
    request('https://api.binance.com/api/v1/ticker/price?symbol=BTCUSDT', function (error, response, body) {
        if(body) {
            if(!isNaN(JSON.parse(body).price))
                priceBinanceBtc = parseFloat(JSON.parse(body).price)
            else 
                getBinanceBtc()
        }
    })
}
getCoinbaseProEth = () => {
    request('https://api.pro.coinbase.com/products/ETH-USD/ticker', function (error, response, body) {
        if(body) {
            if(!isNaN(JSON.parse(body).price))
                priceCoinbaseProEth = parseFloat(JSON.parse(body).price)
            else 
                getCoinbaseProEth()
        }
    })
}            
getCoinbaseProBtc = () => {
    request('https://api.pro.coinbase.com/products/BTC-USD/ticker', function (error, response, body) {
        if(body) {
            if(!isNaN(JSON.parse(body).price))
                priceCoinbaseProBtc = parseFloat(JSON.parse(body).price)
            else 
                getCoinbaseProBtc()
        }
    })
}            
getBitstampEth = () => {
    request('https://www.bitstamp.net/api/v2/ticker/ethusd', function (error, response, body) {
        if(body) {
            if(!isNaN(JSON.parse(body).last))
                priceBitstampEth = parseFloat(JSON.parse(body).last)
            else 
            getBitstampEth()
        }
    })
}
getBitstampBtc = () => {
    request('https://www.bitstamp.net/api/v2/ticker/btcusd', function (error, response, body) {
        if(body) {
            if(!isNaN(JSON.parse(body).last))
                priceBitstampBtc = parseFloat(JSON.parse(body).last)
            else 
                getBitstampBtc()
        }
    })
}
            

function runOncePerDay() {
    setInterval(() => {
        var date = new Date()
        console.log(date.getHours(), date.getMinutes())
        this.getBinanceEth()
        this.getBinanceBtc()
        this.getCoinbaseProEth()
        this.getCoinbaseProBtc()
        this.getBitstampEth()
        this.getBitstampBtc()
        if(date.getHours() === 10 && date.getMinutes() === 49){ // Check the time
            if(priceBinanceBtc
                || priceCoinbaseProBtc
                || priceBitstampBtc
                || priceBinanceEth
                || priceCoinbaseProEth
                || priceBitstampEth){ 
                saveConsolidatedPriceToDatabase('BTC', priceBinanceBtc, priceCoinbaseProBtc, priceBitstampBtc)
                saveConsolidatedPriceToDatabase('ETH', priceBinanceEth, priceCoinbaseProEth, priceBitstampEth)
            }
        } else {
            console.log('Timing does not align at this time.')
        }
    }, 5000)
}

runOncePerDay();
// More routes
app.use('/api/priceEntries', priceEntries);
app.use('/api/consolidatedPriceEntries', consolidatedPriceEntries);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))