// General
exports._HOME = "/";
exports._USER_REGISTER = exports._HOME + "register";
exports._LOGIN_POST = exports._HOME + "login";
exports._USER_LOGOUT = exports._HOME + "logout";
exports._ASSOCIATION_REGISTER = exports._USER_REGISTER + "/association";

// User
exports.__USER_PROFILE = exports._HOME + ":username";
exports.__USER_ACCOUNT = exports.__USER_PROFILE + "/account";
exports.__USER_ACCOUNT_UPDATE = exports.__USER_ACCOUNT + "/update";
exports.__USER_LANG_UPDATE_POST = exports.__USER_ACCOUNT_UPDATE + "/lang";

// Association
exports.__ASSOCIATION_PROFILE = exports._HOME + "association/:name";
exports.__ASSOCIATION_ACCOUNT = exports.__ASSOCIATION_PROFILE + "/account";

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
		_HOME : exports._HOME,
		_USER_REGISTER : exports._USER_REGISTER,
        _ASSOCIATION_REGISTER : exports._ASSOCIATION_REGISTER,
		_LOGIN_POST : exports._LOGIN_POST,
		_USER_LOGOUT : exports._USER_LOGOUT,
		__USER_PROFILE : exports.__USER_PROFILE,
        __USER_ACCOUNT : exports.__USER_ACCOUNT,
        __USER_ACCOUNT_UPDATE : exports.__USER_ACCOUNT_UPDATE,
        __USER_LANG_UPDATE_POST : exports.__USER_LANG_UPDATE_POST,
        __ASSOCIATION_PROFILE : exports.__ASSOCIATION_PROFILE,
        __ASSOCIATION_ACCOUNT : exports.__ASSOCIATION_ACCOUNT
	}
}