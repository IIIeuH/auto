const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('./auth');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const Promise = require("bluebird");
const url = 'mongodb://localhost:27017/auto';
const sockets = require('./sockets');
const config = require('./config');
const time = require('./model/index');

const index = require('./routes/index');
const users = require('./routes/users');



const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.locals.moment = require('moment');
global.moment = require('moment');

app.locals.getTimeFromMins = function (mins) {
    let hours = Math.trunc(mins / 60);
    let minutes = mins % 60;
    if (minutes.toString().length === 1) {
        minutes = '0' + minutes;
    }
    if (hours.toString().length === 1) {
        hours = '0' + hours;
    }
    return hours + ':' + minutes;
};

setInterval(function(){
    time.timer();
}, 1000 * 60);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'secret key for auto',
    resave: true,
    store:  new MongoStore({ url: 'mongodb://localhost:27017/auto' }),
    saveUninitialized: true,
    cookie: {
        maxAge: null
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use('/', index);
app.use('/admin', users);

io.on('connection', function(socket){
    sockets.init(socket);
});

MongoClient.connect(url, { promiseLibrary: Promise })
    .catch(err => console.error(err.stack))
    .then(db => {
        global.db = db;
        global.ObjectId = mongodb.ObjectId;
        http.listen(config.port, async () => {
            console.log(`Server running on the port ${config.port}`);
        });
    });

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
