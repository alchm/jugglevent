if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define( function () {

    var exports = {};

    exports.setModalMessage = function (req,title,lead,body) {
        req.flash('type', "modal");
        if (title !== null) req.flash('title', title);
        if (lead !== null) req.flash('lead', lead);
        if (body !== null) req.flash('body', body);
    }

    return exports;

});
