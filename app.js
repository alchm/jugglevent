////////////////////////////////////////
// Javascript related and miscellaneous
////////////////////////////////////////

require('Miscellaneous').init();

///////////////////////
// Database and Models
///////////////////////

var mongoose = require('mongoose');
//mongoose.connect('mongodb://baptistegouby.com/jugglevent');
mongoose.connect('mongodb://localhost/jugglevent');
var Models = require('Models');
Models.init(mongoose);
var User = mongoose.model('User');
mongoose.connection.on('connected', function(){
    console.log('Database connected');
});

//////////////////
// Authentication
//////////////////

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Auth = require('Authentication');
passport.use(
    new LocalStrategy(
        { usernameField: 'login' },
        Auth.getAuthenticationStrategy(mongoose)
    )
);
passport.serializeUser(Auth.serializeUser);
passport.deserializeUser(Auth.deserializeUser);

////////////////////
// All environments
////////////////////

var express = require('express'),
    http = require('http'),
    path = require('path'),
    flash = require('connect-flash'),
    RedisStore = require('connect-redis')(express);

var app = express();
app.configure(function(){
    app.set('port', process.env.PORT || 8080);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.cookieSession({ secret: 'jfz979-kj90784-zeizzo---ijfe98',
                                    store: new RedisStore                       }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));

    ////////////////////
    // Development only
    ////////////////////

    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
      app.locals.pretty = true;
    }
});


////////////////////
/// SASS
////////////////////
var exec = require("child_process").exec;

exec('sass ' + __dirname + '/public/stylesheets/scss/foundation.scss ' + __dirname + '/public/stylesheets/foundation.css', function (err, stdout, stderr) {
    console.log('SCSS file compiled - Foundation');
});
exec('sass ' + __dirname + '/public/stylesheets/scss/normalize.scss ' + __dirname + '/public/stylesheets/normalize.css', function (err, stdout, stderr) {
    console.log('SCSS file compiled - Normalize');
});


//////////
// Routes
//////////

var Routes = require('./routes/Routes');
app.set("routes", Routes.toObject());
var Controller = require('./controllers/Controller').init(mongoose, passport, Routes);      //
var Middlewares = require('Middlewares'),
    locals = Middlewares.locals,
    FV_login = Middlewares.loginUserFormValidator,
    FV_registration = Middlewares.registrationFormValidator,
    FV_updateUser = Middlewares.updateUserFormValidator,
    FV_association_registration = Middlewares.associationRegistrationFormValidator,
    FV_updateUserLang = Middlewares.updateUserLangFormValidator;

// HTTP GET /
app.get( Routes._HOME,              // "/"
         locals,                    // using locals
         Controller.home );         // using home controller

// HTTP GET /logout
app.get( Routes._USER_LOGOUT,            //
         locals,                    //
         Controller.logout );       //

// HTTP GET /register
app.get( Routes._USER_REGISTER,              //
         locals,                        //
         Controller.showRegister );     //

// HTTP GET /register/association
app.get( Routes._ASSOCIATION_REGISTER,
         locals,
         Controller.showRegisterAssociation );

// HTTP GET /:username
app.get( Routes.__USER_PROFILE,
         locals,
         Controller.showUserDashboard );

// HTTP GET /:username/account
app.get( Routes.__USER_ACCOUNT,
         locals,
         Controller.showUserAccount );

// HTTP POST /login
app.post( Routes._LOGIN_POST,
          locals,
          FV_login,
          Controller.authUser );

// HTTP POST /register
app.post( Routes._USER_REGISTER,
          locals,
          FV_registration,
          Controller.registerUser );

// HTTP POST /register/association
app.post( Routes._ASSOCIATION_REGISTER,
          locals,
          FV_association_registration,
          Controller.registerAssociation );

// HTTP POST /:username/account/update
app.post( Routes.__USER_ACCOUNT_UPDATE,
          locals,
          FV_updateUser,
          Controller.updateUser );

app.post( Routes.__USER_LANG_UPDATE_POST,
          locals,
          FV_updateUserLang,
          Controller.updateUserLanguage );

//////////
// Server
//////////

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


//////////////////////////
//////////////////////////
//////////////////////////