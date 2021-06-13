var express = require('express');
var bodyParser = require("body-parser");
var bot = require('./bot.js');
var path = require('path');

var username = 'admin';
var password = 'V3ryStr0ngP4ssw0rdF0rN0Cr4ck';

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', function(req,res) {
	res.render("admin-bot.ejs");
});

app.post('/', function(req,res) {
	const url = req.body.url;
	bot.visit_with_session(username, password, url);
	res.render("review.ejs");
});

app.listen(process.env.PORT || 7777);
console.log("Listening on port 7777...");


