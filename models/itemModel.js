var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema ({
    name: String,
    shopId: String,
    category: String,
    manufacturer: String,
    retail_price: Number,
    buy_price: Array,
    img: String,
    stock: Number,
    stock_date: Date,
    minStock: Number,
    eor: Number,
    desc: String
});


let Item = module.exports = mongoose.model('Item', itemSchema);