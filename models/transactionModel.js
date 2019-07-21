var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema ({
    userID: String,
    shopID: String,
    doc: Date,
    cart: Object,
});


let Transaction = module.exports = mongoose.model('Transaction', transactionSchema);