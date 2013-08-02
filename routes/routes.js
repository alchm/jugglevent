if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

//////////
// Routes
//////////

define([
    'Router',
    'Middlewares',
    '../controllers/UserController',
    '../controllers/AssociationController'
], function (Router, Middlewares, UserController, AssociationController) {

    var exports                     = {},
        Routes                      = Router.getRoutes(),
        locals                      = Middlewares.locals,
        FV_login                    = Middlewares.loginUserFormValidator,
        FV_registration             = Middlewares.registrationFormValidator,
        FV_updateUser               = Middlewares.updateUserFormValidator,
        FV_association_registration = Middlewares.associationRegistrationFormValidator,
        FV_updateUserLang           = Middlewares.updateUserLangFormValidator;

    exports.init = function (app) {
        /****************************
         *  Route declaration pattern
         *  app.<method>( Routes.<route-name>,
         *                middlewares,
         *                Controller.<action><Who><What> );
         */

        app.get('/app', locals, function(req, res) { res.render('shared/layout'); });

        // HTTP GET /
        app.get( Routes._HOME,
                 locals,
                 UserController.showHome );

        // HTTP GET /logout
        app.get( Routes._USER_LOGOUT,
                 locals,
            UserController.logout );

        // HTTP GET /register
        app.get( Routes._USER_REGISTER,
                 locals,
                UserController.showRegister );

        // HTTP GET /register/association
        app.get( Routes._ASSOCIATION_REGISTER,
                 locals,
                 AssociationController.showRegister );

        // HTTP GET /:username
        app.get( Routes.__USER_PROFILE,
                 locals,
                 UserController.showDashboard );

        // HTTP GET /:username/account
        app.get( Routes.__USER_ACCOUNT,
                 locals,
                 UserController.showAccount );

        // HTTP GET /association/:name
        app.get( Routes.__ASSOCIATION_PROFILE,
                 locals,
                 AssociationController.showProfile );

        // HTTP GET /association/:name/follow
        app.get( Routes.__ASSOCIATION_FOLLOW,
                 locals,
                 AssociationController.addFollower );

        // HTTP GET /association/:name/unfollow
        app.get( Routes.__ASSOCIATION_UNFOLLOW,
                 locals,
                 AssociationController.removeFollower );

        // HTTP POST /login
        app.post( Routes._LOGIN_POST,
                  locals,
                  FV_login,
                  UserController.auth );

        // HTTP POST /register
        app.post( Routes._USER_REGISTER,
                  locals,
                  FV_registration,
                  UserController.register );

        // HTTP POST /register/association
        app.post( Routes._ASSOCIATION_REGISTER,
                  locals,
                  FV_association_registration,
                  AssociationController.register );

        // HTTP POST /:username/account/update
        app.post( Routes.__USER_ACCOUNT_UPDATE,
                  locals,
                  FV_updateUser,
                  UserController.update );

        app.post( Routes.__USER_LANG_UPDATE_POST,
                  locals,
                  FV_updateUserLang,
                  UserController.updateLanguage );

    }

    return exports;

});