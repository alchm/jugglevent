if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

//////////////////////////
// User Socket Controller
//////////////////////////

define([
    'mongoose',
    'api/User',
], function (mongoose, UserAPI) {

	var exports	= {},
		City    = mongoose.model('City'),
        School  = mongoose.model('School');

	/*
     Save the user language preference
     */
    exports.updateLanguage = function(socket, data) {
        if (req.user) {
            if (req.form.isValid) {
                UserAPI.updateLanguage(ID, VALUES_OBJECT, function(err, user) {
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