"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var app = express();

app.use('/ui', express.static('static'));
app.get('/ui*', (req, res) => {
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	res.sendFile(__dirname + '/app/index.html');
});

//app.use(bodyParser.);
//app.use((require 'method-override')(method-override));
app.use(router);

var server = app.listen(3000, () => console.log('Server running at http://localhost:'+server.address().port) + '...');
