if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    'mongoose',
    'api/User',
    'api/Association',
    'Router',
    'controllers/helpers/FormErrors',
    'controllers/helpers/ModalMessage'
], function (mongoose, UserAPI, AssociationAPI, Router, FormErrors, ModalMessage) {

    var exports = {};

    var City    = mongoose.model('City'),
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
            AssociationAPI.getProfileData(req.params.name, function(err, data){
                if (!err) res.render('association-public.jade', { data: data } );
                else res.redirect(Routes._HOME);
            });
        } else {
            res.send('you\'re not connected');
        }
    };

    /*
     Register a new association
     */
    exports.register = function(req, res) {
        if (req.user) res.send('you are connected, you cannot already create an association');
        else {
            if (req.form.isValid) {
                AssociationAPI.new(req, function(err, asso){
                    if (asso) {
                        ModalMessage.setModalMessage(req, "Success !", null, "Your association have been successfully created");
                        res.redirect(Routes._HOME);
                    } else {
                        ModalMessagesetModalMessage(req, "We're sorry", null, "We didn't succeeded to perform your registration, please try again or contact and administrator");
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