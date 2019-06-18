var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shopSchema = new Schema ({
    name: String,
    categories: Array,
    email: String,
    password: String,
    sales: Object,
    img: String,
    itemCategories: Array,
    manufacturers: Array,
    status: String
});


let Shop = module.exports = mongoose.model('Shop', shopSchema);