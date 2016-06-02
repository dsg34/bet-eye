var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config.js')
var http = require('http');
http.post = require('http-post');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var jwtCheck = require('express-jwt');


var tickets = require('./routes/tickets');
var usuarios = require('./routes/usuarios');
var estadisticas = require('./routes/estadisticas');
var open = require('./routes/open');

var app = express();

//Permite que en producción se pueda acceder a las funciones de la API de forma externa
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "http://localhost:63342");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Comprobamos que hay token de acceso a la API
/*
app.use('/api', jwtCheck({
        secret: config.session.secret,
        userProperty: 'tokenPayload'
    })
);
*/

app.use('/api/estadisticas', estadisticas);
app.use('/api/usuarios', usuarios);
app.use('/api/tickets', tickets);
app.use('/', open);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//conexion a bbdd
mongoose.connect(config.bbdd, function(err) {
//mongoose.connect('mongodb://localhost/test', function(err) {
    if(err) {
        console.log('Connection error', err);
    } else {
        console.log('Connection successful');
    }
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
