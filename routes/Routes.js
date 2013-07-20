exports._ROOT = "/";
exports._REGISTER = exports._ROOT + "register";
exports._REGISTER_ASSOCIATION = exports._REGISTER + "/association";
exports._LOGIN = exports._ROOT + "login";
exports._LOGOUT = exports._ROOT + "logout";
exports.__USERNAME = exports._ROOT + ":username";
exports.__USERNAME_ACCOUNT = exports.__USERNAME + "/account";
exports.__USERNAME_ACCOUNT_UPDATE = exports.__USERNAME_ACCOUNT + "/update";

exports.generate = function(route, descriptorObject) {
    for (var prop in descriptorObject) {
        if (descriptorObject.hasOwnProperty(prop))
            if (route.containsString(prop))
                route = route.replace(prop, descriptorObject[prop]);
    }
    return route;
}

exports.toObject = function() {
	return {
		_ROOT : exports._ROOT,
		_REGISTER : exports._REGISTER,
        _REGISTER_ASSOCIATION : exports._REGISTER_ASSOCIATION,
		_LOGIN : exports._LOGIN,
		_LOGOUT : exports._LOGOUT,
		__USERNAME : exports.__USERNAME,
        __USERNAME_ACCOUNT : exports.__USERNAME_ACCOUNT,
        __USERNAME_ACCOUNT_UPDATE : exports.__USERNAME_ACCOUNT_UPDATE
	}
}