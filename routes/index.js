var express = require('express')
var app = express()
 
app.get('/', function(req, res) {
    res.render('index', {title: 'Bla bla bla'})
})


module.exports = app;