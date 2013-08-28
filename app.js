////////////////////////////////////////
// Javascript related and miscellaneous
////////////////////////////////////////
var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require
});


requirejs([ 'http',             // HTTP server
            'socket.io',        // Socket.io server
            'module',           // Module
            'path',             // Path
            'consolidate',      // Consolidate
            'express',          // Express
            'mongoose',         // Mongoose
            'Models',           // Models
            'Miscellaneous',    // Others/Misc
            'passport',         // Passport auth
            'passport-local',   // Passport local
            'Authentication',   // Authentication module
            'connect-redis',    // Redis
            'connect-flash',    // Flash
            'routes/routes',
            'routes/sockets'  ],
            function (  http,
                        socketio,
                        module,
                        path,
                        consolidate,
                        express,
                        mongoose,
                        Models,
                        misc,
                        passport,
                        passportLocal,
                        Auth,
                        redis,
                        flash,
                        routes,
                        sockets       ) {

    // Express
    var app = express();
    misc.init();

    ///////////////////////
    // Database and Models
    ///////////////////////

     //mongoose.connect('mongodb://baptistegouby.com/jugglevent');
     mongoose.connect('mongodb://localhost/jugglevent');
     //Models.init(mongoose);
     mongoose.connection.on('connected', function() {
        console.log('MongoDB connected');
     });
     mongoose.connection.on('error', function() {
        console.log('Unable to connect MongoDB');
     });

    //////////////////
    // Authentication
    //////////////////
     var LocalStrategy = passportLocal.Strategy;
     passport.use( new LocalStrategy( { usernameField: 'login' },
                                      Auth.getAuthenticationStrategy(mongoose) ) );
     passport.serializeUser(Auth.serializeUser);
     passport.deserializeUser(Auth.deserializeUser);

    var RedisStore = redis(express);

    app.configure( function() {

        ////////////////////
        // All environments
        ////////////////////

        app.set('port', process.env.PORT || 9999);
        app.set('views', path.dirname(module.uri) + '/views');
        app.set('view engine', 'jade');
        app.set('view engine', 'html');
        app.engine('html', consolidate.underscore); // using underscore.js template engine with consolidate

        app.use(express.bodyParser());
        app.use(express.cookieParser("jfz979-kj90784-zeizzo---ijfe98"));
        app.use(express.cookieSession({ secret: 'jfz979-kj90784-zeizzo---ijfe98',
                                        store: new RedisStore                       }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(app.router);
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.methodOverride());
        app.use(express.static(path.join(path.dirname(module.uri), 'public')));

        ////////////////////
        // Development only
        ////////////////////

        if ('development' == app.get('env')) {
          app.use(express.errorHandler());
          app.locals.pretty = true;
        }

    });
    routes.init(app);

    //////////
    // Server
    //////////

    var server = http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });

    /////////////
    // Socket.io
    /////////////
    sockets.init( socketio.listen(server) );

});