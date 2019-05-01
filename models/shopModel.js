var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shopSchema = new Schema ({
    name: String,
    categories: Array,
    email: String,
    password: String,
    sales: Object,
    inventory: Object,
});


let Shop = module.exports = mongoose.model('Shop', shopSchema);