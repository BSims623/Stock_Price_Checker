'use strict';
const axios = require('axios')

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      if (Array.isArray(req.query.stock)) {
        console.log(req.query);
        const stockOne = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock[0]}/quote`)
        const stockTwo = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock[1]}/quote`)
        let stockOneResult = stockOne;
        let stockTwoResult = stockTwo;

        if (stockOne.data.symbol) {

        }

        res.status(200).json({ "stockData": [{ "stock": stockOne, "price": 62.30, "rel_likes": -1 }, { "stock": stockTwo, "price": 786.90, "rel_likes": 1 }] })

      } else {
        try {
          let result = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock}/quote`)
          const symbol = result.data.symbol
          const price = result.data.latestPrice
          console.log(result.data);
          console.log(req.query);
          if (symbol) {
            res.status(200).json({ "stockData": { "stock": result.data.symbol, "price": price, "likes": 1 } })
          } else {
            res.status(200).json({ "stockData": { "error": result.data } })
          }

        } catch (error) {
          console.log(error + " HELLO");
          res.status(500).send('error')
        }
      }

    });

};
