'use strict';
const axios = require('axios');
const User = require('../Models/UserModel.js');
const findOrCreateUser = require('../utils/handleUser.js')
const { findOrCreateStock, updateLikes } = require('../utils/handleStock.js');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      if (Array.isArray(req.query.stock)) {
        const symbolOne = req.query.stock[0];
        const symbolTwo = req.query.stock[1];
        const stockOne = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbolOne}/quote`);
        const stockTwo = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbolTwo}/quote`);
        const stockOneSymbol = stockOne.data.symbol;
        const stockTwoSymbol = stockTwo.data.symbol;
        const isLiked = req.query.like;

        if (stockOneSymbol && stockTwoSymbol) {
          let likesOne = await findOrCreateStock(stockOneSymbol);
          let likesTwo = await findOrCreateStock(stockTwoSymbol);
          if (isLiked === 'true') {
            const user = await findOrCreateUser(req.ip);
            likesOne = await updateLikes(stockOneSymbol, user.userName);
            likesTwo = await updateLikes(stockTwoSymbol, user.userName);
          }
          const relLikesOne = (likesOne - likesTwo);
          const relLikesTwo = (likesTwo - likesOne);
          res.status(200).json({ "stockData": [{ "stock": stockOneSymbol, "price": stockOne.data.latestPrice, "rel_likes": relLikesOne }, { "stock": stockTwoSymbol, "price": stockTwo.data.latestPrice, "rel_likes": relLikesTwo }] });
        } else if (!stockOneSymbol && stockTwoSymbol) {
          let relLikesTwo = await findOrCreateStock(stockTwoSymbol);
          if (isLiked === 'true') {
            const user = await findOrCreateUser(req.ip);
            relLikesTwo = await updateLikes(stockTwoSymbol, user.userName);
          }
          const relLikesOne = (relLikesTwo * -1);

          res.status(200).json({ "stockData": [{ "error": stockOne.data, "rel_likes": relLikesOne }, { "stock": stockTwoSymbol, "price": stockTwo.data.latestPrice, "rel_likes": relLikesTwo }] });
        } else if (stockOneSymbol && !stockTwoSymbol) {
          let relLikesOne = await findOrCreateStock(stockOneSymbol);
          if (isLiked === 'true') {
            const user = await findOrCreateUser(req.ip);
            relLikesOne = await updateLikes(stockOneSymbol, user.userName);
          }
          const relLikesTwo = (relLikesOne * -1);
          res.status(200).json({ "stockData": [{ "stock": stockOneSymbol, "rel_likes": relLikesOne }, { "error": stockTwo.data, "rel_likes": relLikesTwo }] });
        }
      } else {
        const isLiked = req.query.like;
        let result = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock}/quote`)
        const symbol = result.data.symbol
        const price = result.data.latestPrice
        if (symbol) {
          let likes = await findOrCreateStock(symbol);
          if (isLiked === 'true') {
            const user = await findOrCreateUser(req.ip);
            likes = await updateLikes(symbol, user.userName);
          }
          res.status(200).json({ "stockData": { "stock": result.data.symbol, "price": price, "likes": likes } })
        } else {
          res.status(200).json({ "stockData": { "error": result.data } })
        }
      }
    });

};
