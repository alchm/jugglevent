if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'mongoose',
    'passport',
    'api/User',
    'api/Association',
    '../node_modules/Router',
    'helpers/FormErrors',
    'helpers/ModalMessage'
], function (mongoose, passport, UserAPI, AssociationAPI, Router, FormErrors, ModalMessage) {

    var exports = {};

    var City    = mongoose.model('City'),
        School  = mongoose.model('School'),
        Routes  = Router.getRoutes();

    /*
     Home page
     */
    exports.showHome = function(req, res) {
        if (req.user) {
            res.render('jugglevent-timeline');
        }
        else {
            res.render('jugglevent-login');
        }
    };

    /*
     Register user page
     */
    exports.showRegister = function(req, res) {
        if (!req.user)
            City.find({}, function(err, cities) {
                res.render('jugglevent-register-user', {
                    cities: cities
                });
            });
        else res.redirect(Routes._HOME);
    };

    /*
     User dashboard page
     */
    exports.showDashboard = function(req, res) {
        if (req.user) {
            if (req.params.username == req.user.username) {
                res.render('user-dashboard');
            } else UserAPI.getDashboardData(req, function(err, userData) {
                if (userData) {
                    if (!err) {
                        console.log("userData:");
                        console.log(userData);
                        res.render('user-public-page', { data: userData });
                    } else console.log(err);
                } else res.redirect(Routes._HOME);
            });
        } else res.redirect(Routes._HOME);
    }

    /*
     User modification page
     */
    exports.showAccount = function(req, res) {
        console.log(req.user);
        if (req.user) {
            if (req.user.username == req.params.username) {
                City.find({}).ne('_id', req.user.city).exec( function(err, cities) {
                    if (cities) {
                        City.findOne({ '_id': req.user.city }, function(err, userCity) {
                            UserAPI.getAssociations(req, function(err, data) {
                                res.render('user-account', { cities : cities,
                                    userCity : userCity,
                                    associations : data.associations });
                            });
                        });
                    }
                });
            } else res.redirect(Routes.generate( Routes.__USER_PROFILE, { ':username': req.params.username } ));
        }
        else { console.log('no req user'); res.redirect(Routes._HOME); }
    }

    /*
     User authentication function
     */
    exports.auth = function(req, res) {
        if (!req.user) {
            if (req.form.isValid) {
                passport.authenticate('local', function(err, user) {
                    if (!err && user) {
                        req.logIn(user, function(err) {
                            if (!err) {
                                ModalMessage.setModalMessage(req, "Welcome !", null, "Welcome on your timeline !");
                                res.redirect(Routes._HOME);
                            } else {
                                ModalMessage.setModalMessage(req, "We're sorry", "ERR_LOGIN", "Unsuccessfull login, please try again :)");
                                res.redirect(Routes._HOME);
                            }
                        });
                    } else {
                        ModalMessage.setModalMessage(req, "We're sorry", "ERR_AUTH", "Unsuccessfull login, please try again :)");
                        res.redirect(Routes._HOME);
                    }
                })(req,res);
            } else {
                FormErrors.setFormErrors(req);
                res.redirect(Routes._HOME);
            }
        } else { res.redirect(Routes._HOME); }
    }

    /*
     Logout function
     */
    exports.logout = function(req, res){
        /*
         Erase session and use Passport.js logout function
         Then redirect to '/'
         */
        req.session = null;
        req.logout();
        res.redirect(Routes._HOME);
    };

    /*
     Register function
     */
    exports.register = function(req, res) {
        /*
         If there's no connected user and if the form validator passed
         It creates a new user using the user API
         Then we redirect to the home page
         */
        console.log('user register:');
        if (!req.user){
            console.log('user not connected');
            if (req.form.isValid) {
                console.log('form valid');
                UserAPI.new(req);
                ModalMessage.setModalMessage(req, "Success !", null, "Your account have been successfully created !");
                res.redirect(Routes._HOME);

                // If the form is not valid
            } else {
                console.log('form error:');
                FormErrors.setFormErrors(req);
                res.redirect(Routes._USER_REGISTER);
            }

            /*
             If a user is logged in, we redirect
             */
        } else { consle.log('user connected'); res.redirect(Routes._HOME); }
    }

    /*
     Update user function
     */
    exports.update = function(req, res) {
        /*
         If there's no connected user and if the form validator passed
         It updates the user using the user API
         Then we redirect to the home page
         */
        if (req.user)
            if (req.form.isValid) {
                UserAPI.update(req);
                ModalMessage.setModalMessage(req, null, 'User succesfully updated :)', 'You must log you off to reload your informations');
                res.redirect(Routes.generate( Routes.__USER_ACCOUNT, {":username" : req.user.username} ));
            } else {
                FormErrors.setFormErrors(req);
                res.redirect(Routes.generate( Routes.__USER_ACCOUNT, {":username" : req.user.username} ));
            }
        else res.redirect(Routes._HOME);
    }

    /*
     Save the user language preference
     */
    exports.updateLanguage = function(req, res) {
        if (req.user) {
            if (req.form.isValid) {
                UserAPI.updateLanguage(req, function(err, user) {
                    if (!err) {
                        ModalMessage.setModalMessage(req, "Success !", null, "Your language preference has been successfully saved");
                        res.redirect( Routes.generate( Routes.__USER_ACCOUNT, {":username" : req.user.username} ));
                    } else {
                        ModalMessage.setModalMessage(req, "Error !", "ERR_SAVE", "");
                        res.redirect( Routes.generate( Routes.__USER_ACCOUNT, {":username" : req.user.username} ));
                    }
                });
            } else {
                FormErrors.setFormErrors(req);
                res.redirect( Routes.generate( Routes.__USER_ACCOUNT_UPDATE, { ":username" : req.user.username} ));
            }
        } else res.redirect(Routes._HOME);
    }

    return exports;

});

// POPULATING CITIES DATABASE :
/*
 var city = new City();
 city.name = "Montréal";
 city.save(function(err){
 if (!err) res.send('Montréal created :)');
 else res.send("Montréal not created :(");
 });
 */

// POPULATING SCHOOLS DATABASES
/*
 var school = new School();
 school.name = "HEC Montréal";
 school.save(function(err){
 if (!err) res.send('HEC Montréal created :)');
 else res.send("HEC Montréal not created :(");
 });
 */