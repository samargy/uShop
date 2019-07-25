var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema ({
    userID: String,
    shopIDs: Array,
    doc: Date,
    cart: Object,
});


let Transaction = module.exports = mongoose.model('Transaction', transactionSchema);