if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'mongoose',
    'passport',
    'api/User',
    'api/Association',
    'Router',
    'controllers/helpers/FormErrors',
    'controllers/helpers/ModalMessage'
], function (mongoose, passport, UserAPI, AssociationAPI, Router, FormErrors, ModalMessage) {

    var exports = {};

    console.log(ModalMessage);

    var City    = mongoose.model('City'),
        School  = mongoose.model('School'),
        Routes  = Router.getRoutes();

    /*
     Home page
     */
    exports.showHome = function(req, res) {
        if (req.user) {
            res.render('jugglevent-timeline.jade');
        }
        else {
            res.render('jugglevent-login.jade');
        }
    };

    /*
     Register user page
     */
    exports.showRegister = function(req, res) {
        if (!req.user)
            City.find({}, function(err, cities) {
                res.render('jugglevent-register-user.jade', {
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
                res.render('user-dashboard.jade');
            } else UserAPI.getDashboardData(req.user, function(err, userData) {
                if (userData) {
                    if (!err) {
                        res.render('user-public-page.jade', { data: userData });
                    } else console.log(err);
                } else res.redirect(Routes._HOME);
            });
        } else res.redirect(Routes._HOME);
    }

    /*
     User modification page
     */
    exports.showAccount = function (req, res) {
        if (req.user) {
            if (req.user.username == req.params.username) {
                City.find({}).ne('_id', req.user.city).exec( function(err, cities) {
                    if (cities) {
                        City.findOne({ '_id': req.user.city }, function(err, userCity) {
                            UserAPI.getAssociations(req.user, function(err, data) {
                                res.render('user-account.jade', { cities : cities,
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
        if (!req.user){
            if (req.form.isValid) {
                UserAPI.new(req.body, function (err, user) {
                    if (!err) {
                        ModalMessage.setModalMessage(req, "Success !", null, "Your account have been successfully created !");
                        res.redirect(Routes._HOME);
                    } else {
                        ModalMessage.setModalMessage(req, "We're sorry", null, "An error occured, please try again");
                        res.redirect(Routes._USER_REGISTER);
                    }
                });

                // If the form is not valid
            } else {
                FormErrors.setFormErrors(req);
                res.redirect(Routes._USER_REGISTER);
            }

            /*
             If a user is logged in, we redirect
             */
        } else res.redirect(Routes._HOME);
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
                UserAPI.update(req.user._id, req.body, function (err, user) {
                    if (!err) {
                        ModalMessage.setModalMessage(req, null, 'User succesfully updated :)', 'You must log you off to reload your informations');
                        res.redirect(Routes.generate( Routes.__USER_ACCOUNT, {":username" : req.user.username} ));
                    } else {
                        ModalMessage.setModalMessage(req, "We're sorry", null, "An error occured, please try again");
                        res.redirect(Routes.generate( Routes.__USER_ACCOUNT, {":username" : req.user.username} ));
                    }
                });
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
                UserAPI.updateLanguage(req.user._id, req.body, function(err, user) {
                    if (!err) {
                        ModalMessage.setModalMessage(req, "Success !", null, "Your language preference has been successfully saved");
                        res.redirect( Routes.generate( Routes.__USER_ACCOUNT, {":username" : req.user.username} ));
                    } else {
                        ModalMessage.setModalMessage(req, "Error !", err.message, "An error occurred, please try again");
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