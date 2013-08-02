if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'mongoose',
    'api/User',
    'api/Association',
    'Router',
    'controllers/helpers/FormErrors',
    'controllers/helpers/ModalMessage',
    'underscore',
    'async'
], function (mongoose, UserAPI, AssociationAPI, Router, FormErrors, ModalMessage, _, async) {
    var exports = {},
        City    = mongoose.model('City'),
        School  = mongoose.model('School'),
        Routes  = Router.getRoutes();

    /*
     Register association page
     */
    exports.showRegister = function(req, res) {
        if (!req.user) {
            /*
             Retrieving cities and schools
             */
            City.find({}, function(err, cities) {
                if (!err)
                    School.find({}, function(err, schools) {
                        if (!err)
                            res.render('jugglevent-register-association.jade', { //
                                cities: cities,                             // Render view
                                schools: schools                            //
                            });
                    });
            });
        } else res.redirect(Routes._HOME);
    };

    /*
     Association profile page
     */
    exports.showProfile = function(req, res) {
        if (req.user) {
            AssociationAPI.getProfileData(req.params.name, function (err, data) {
                if (!err) {
                    if (data) {
                        async.waterfall([
                            function (callback) {
                                var pluck = _.pluck(data.followers, 'username');
                                callback(null, pluck);
                            },
                            function (pluck, callback) {
                                var isFollowing = _.contains(pluck, req.user.username);
                                callback(null, isFollowing);
                            }
                        ], function (err, isFollowing) {
                            data.isFollowing = isFollowing;
                            res.render('association-public.jade', { data: data });
                        });
                    }
                } else res.redirect(Routes._HOME);
            });
        } else {
            res.send('you\'re not connected');
        }
    };

    /*
     Add a new follower
     */
    exports.addFollower = function (req, res) {
        if (req.user) {
            AssociationAPI.addFollower(req.params.name, req.user._id, function (err) {
                if (!err) {
                    res.redirect(Router.generate( Routes.__ASSOCIATION_PROFILE, { ':name': req.params.name } ));
                } else {
                    // TODO: ModalMessage.setModalMessage() -> ModalMessage.set();
                    ModalMessage.setModalMessage(req, "We're sorry", null, "An error occurred while adding you as follower");
                    res.redirect(Router.generate( Routes.__ASSOCIATION_PROFILE, { ':name': req.params.name } ));
                }
            });
        } else res.redirect(Routes._HOME);
    };

    /*
     Remove a follower
     */
    exports.removeFollower = function (req, res) {
        if (req.user) {
            AssociationAPI.removeFollower(req.params.name, req.user._id, function (err) {
                if (!err) res.redirect(Router.generate( Routes.__ASSOCIATION_PROFILE, { ':name': req.params.name } ));
                else {
                    ModalMessage.setModalMessage(req, "We're sorry", null, "An error occurred while removing you as follower");
                    res.redirect(Router.generate( Routes.__ASSOCIATION_PROFILE, { ':name': req.params.name } ));
                }
            });
        } else res.redirect(Routes._HOME);
    }

    /*
     Register a new association
     */
    exports.register = function(req, res) {
        if (req.user) res.send('you are connected, you cannot already create an association');
        else {
            if (req.form.isValid) {
                AssociationAPI.new(req.body, function(err, asso){
                    if (asso) {
                        ModalMessage.setModalMessage(req, "Success !", null, "Your association have been successfully created");
                        res.redirect(Routes._HOME);
                    } else {
                        ModalMessage.setModalMessage(req, "We're sorry", null, "We didn't succeeded to perform your registration, please try again or contact and administrator");
                        res.redirect(Routes._HOME);
                    }
                });
            } else {
                FormErrors.setFormErrors(req);
                res.redirect(Routes._ASSOCIATION_REGISTER);
            }
        }
    };

    return exports;

});