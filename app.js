const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const url = require('./config/keys').mongoURI;


const indexRouter = require('./routes/index'),
    apiRouter = require('./routes/api'),
    deleteRouter = require('./routes/delete'),
    createRouter = require('./routes/create'),
    downloadRouter = require('./routes/download'),
    mediaRouter = require('./routes/media');


const app = express();

// Connect to database (MongoDB)
mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
console.log('MongoDB Connected! @: ', url);
});

//Cookie parser
app.use(cookieParser({
  secret: 'secretCode'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/home', apiRouter);
app.use('/delete', deleteRouter);
app.use('/create', createRouter);
app.use('/download', downloadRouter);
app.use('/media', mediaRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
