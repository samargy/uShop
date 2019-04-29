
//Getting the dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 3000;

//Starting App (on localhost:3000/)
app.listen(port, function() {
    console.log('Server started on port ' + port);
});

//Setting the public directory
app.use(express.static('public'));

//Setting up view engine (Pug)
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Rendering home Page
app.get('/', function(req, res) {
    res.render('home');
});
