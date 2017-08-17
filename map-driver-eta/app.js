var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var apiLyftController = require('./routes/api/lyft');
var config = require('./config/config');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/lyft/eta', apiLyftController.getEta);

app.get('/', function (req, res, next) {
  res.render('index');
});

app.listen(config.PORT, function () {
  console.log([
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'lyft-driver-eta running',
    ' => http://localhost:' + config.PORT,
    ' => [ ctrl + c ] to quit',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
  ].join('\n'));
});