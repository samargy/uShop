var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema ({
    givenName: String,
    lastName: String,
    address: String,
    state: String,
    postcode: String,
    dob: Date,
    mobileNumber: String,
    email: String,
    password: String,
    cart: Object,
    bookmarks: Array
});


let User = module.exports = mongoose.model('User', userSchema);