var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var saleSchema = new Schema ({
    userID: String,
    shopID: String,
    dos: Date,
    items: Array
});


let Sale = module.exports = mongoose.model('Sale', shopSchema);