'use strict';

var config = require('./config'),
	http = require('http'),
	socketio = require('socket.io'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	flash = require('connect-flash'),
	passport = require('passport');

module.exports = function(db) {
	var app = express();
	var server = http.createServer(app);
	var io = socketio.listen(server);


	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	// Use the 'body-parser' and 'method-override' middleware functions
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	var mongostore = new MongoStore({
		db : db.connection.db
	});
	
	app.use(session({
		saveUninitialized : true,
		resave: true,
		secret: config.sessionSecret,
		store:mongostore
		
	}));

	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));

	app.set('views', './app/views');
	app.set('view engine', 'ejs');

	app.use(flash());

	app.use(passport.initialize());
	app.use(passport.session());

	// Load the routing files
	require('../app/routes/landing.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);
	require('../app/routes/controlpanel.server.routes.js')(app);

	// Configure static file serving
	app.use(express.static('./public'));

	require('./socketio')(server, io, mongostore);
	// Return the Express application instance
	return server;
};