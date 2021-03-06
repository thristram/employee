var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
global.config = require("./config.js");


const SQLAction = require('./Modules/SQLActions.js');

var indexRouter = require('./routes/index');
var setupRouter = require('./routes/setup');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = path.join(__dirname, 'views');;
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/setup', setupRouter);
app.use(function(req, res, next) {
	if(SQLAction.getConnectionStatus()){
		next()
	}   else {
		if(!global.config || !global.config.hasOwnProperty("database") || !global.config.database.host || !global.config.database.user){
			res.redirect("/setup")
		}
		SQLAction.createConnection(function (status) {
			if(status){
				next()
			}   else    {
				res.redirect("/setup?error=connection")
			}
		});

	}

});

app.use('/', indexRouter);
app.use('/api', apiRouter);

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
