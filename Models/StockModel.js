const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    symbol: String,
    likes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Stock', StockSchema);
