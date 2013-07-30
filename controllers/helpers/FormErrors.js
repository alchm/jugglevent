if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define( function () {

    var exports = {};

    exports.setFormErrors = function (req) {
        req.flash('type', "form-errors");
        if (req.form.errors) req.flash('errors', parseFormErrors(req.form.errors));
    }

    return exports;

});

function parseFormErrors(errorsArr) {
    var errors = {},
        error;
    for (var i= 0; i<errorsArr.length; i=i+1) {
        error = errorsArr[i].split(':');
        errors[error[0]] = error[1];
    }
    return errors;
}