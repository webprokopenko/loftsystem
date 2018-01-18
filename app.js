const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:root@ds247317.mlab.com:47317/loftsystem', { useMongoClient: true });

//view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
// body parser set
app.use(bodyParser.json({ type: 'text/plain' }));
app.use(bodyParser.urlencoded({extended: false}));
//static file
app.use(express.static(path.join(__dirname, 'public')));
//routes require
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500); 
  //res.render('error', { message: err.message, error: err });
});

const server = app.listen(process.env.PORT || 2300, function() {
  console.log('Сервер запущен на порте: ' + server.address().port);
});
