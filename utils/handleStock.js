const mongoose = require('mongoose');
const Stock = require('../Models/StockModel');
const User = require('../Models/UserModel');

const findOrCreateStock = async (symbol) => {
    let stock = await Stock.findOne({ symbol: symbol });
    if (!stock) {
        stock = await Stock.create({ symbol: symbol });
        return stock.likes
    }
    return stock.likes
}

const updateLikes = async (symbol, userName) => {
    const user = await User.findOne({ userName: userName });
    if (user.likes.includes(symbol)) {
        const getStock = await Stock.findOne({ symbol: symbol });
        return getStock.likes
    } else {
        const updatedUser = await User.findOneAndUpdate({ userName: userName }, { $push: { likes: symbol } }, { new: true });
        const updatedStock = await Stock.findOneAndUpdate({ symbol: symbol }, { $inc: { likes: 1 } }, { new: true });
        return updatedStock.likes
    }
}



module.exports = { findOrCreateStock, updateLikes };