///////////////
// Controllers
///////////////

// Use the user API to add, modify, update or delete user
var mongoose;
var passport;
var UserAPI;
var City;
var School;
var AssociationAPI;
var Routes;
exports.init = function(dataProvider, authProvider, routes) {
    mongoose = dataProvider;
    passport = authProvider;
    UserAPI = require('UserAPI.js').init(dataProvider);
    AssociationAPI = require('AssociationAPI.js').init(dataProvider);
    City = mongoose.model('City');
    School = mongoose.model('School');
    Routes = routes;
    return exports;
};

/////////
// Pages
/////////

/*
Home page
  */
exports.home = function(req, res) {
    if (req.user) {
        res.render('jugglevent-timeline');
    }
    else {
        res.render('jugglevent-login');
    }
};

/*
Register page
  */
exports.showRegister = function(req, res) {
    if (!req.user)
        City.find({}, function(err, cities) {
            res.render('jugglevent-register-user', {
                cities: cities
            }); 
        });
    else res.redirect(Routes._HOME);
}

/*
Register association page
  */
exports.showRegisterAssociation = function(req, res) {
    if (!req.user) {
        /*
        Retrieving cities and schools
        */
        City.find({}, function(err, cities) {
            if (!err)
                School.find({}, function(err, schools) {
                    if (!err)
                        res.render('jugglevent-register-association', { //
                            cities: cities,                             // Render view
                            schools: schools                            //
                        });
                });
        });
    } else res.redirect(Routes._HOME);
}

/*
User page
  */
exports.showUserDashboard = function(req, res) {
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
exports.showUserAccount = function(req, res) {
    console.log(req.user);
    if (req.user) {
        if (req.user.username == req.params.username) {
            City.find({}).ne('_id', req.user.city).exec( function(err, cities) {
                if (cities) {
                    City.findOne({ '_id': req.user.city }, function(err, userCity) {
                        res.render('user-account', { cities : cities,
                                                    userCity : userCity });
                    });
                }
            });
        } else res.redirect(Routes.generate( Routes.__USER_PROFILE, { ':username': req.params.username } ));
    }
    else { console.log('no req user'); res.redirect(Routes._HOME); }
}

/////////////
// Functions
/////////////   

exports.authUser = function(req, res) {
    if (!req.user) {
        if (req.form.isValid) {
            passport.authenticate('local', function(err, user) {
                if (!err && user) {
                    req.logIn(user, function(err) {
                        if (!err) {
                            setModalMessage(req, "Welcome !", null, "Welcome on your timeline !");
                            res.redirect(Routes._HOME);
                        } else {
                            setModalMessage(req, "We're sorry", "ERR_LOGIN", "Unsuccessfull login, please try again :)");
                            res.redirect(Routes._HOME);
                        }
                    });
                } else {
                    setModalMessage(req, "We're sorry", "ERR_AUTH", "Unsuccessfull login, please try again :)");
                    res.redirect(Routes._HOME);
                }
            })(req,res);
        } else {
            setFormErrors(req);
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
exports.registerUser = function(req, res) {
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
            setModalMessage(req, "Success !", null, "Your account have been successfully created !");
            res.redirect(Routes._HOME);

        // If the form is not valid
        } else {
            console.log('form error:');
            setFormErrors(req);
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
exports.updateUser = function(req, res) {
    /*
     If there's no connected user and if the form validator passed
     It updates the user using the user API
     Then we redirect to the home page
     */
    if (req.user)
        if (req.form.isValid) {
            UserAPI.update(req);
            setModalMessage(req, null, 'User succesfully updated :)', 'You must log you off to reload your informations');
            res.redirect(Routes.generate( Routes.__USER_ACCOUNT, {":username" : req.user.username} ));
        } else {
            setFormErrors(req);
            res.redirect(Routes.generate( Routes.__USER_ACCOUNT, {":username" : req.user.username} ));
        }
    else res.redirect(Routes._HOME);
}

/*
Save the user language preference
 */
exports.updateUserLanguage = function(req, res) {
    if (req.user) {
        if (req.form.isValid) {
            UserAPI.updateLanguage(req, function(err, user) {
                if (!err) {
                    setModalMessage(req, "Success !", null, "Your language preference has been successfully saved");
                    res.redirect( Routes.generate( Routes.__USER_ACCOUNT, {":username" : req.user.username} ));
                } else {
                    setModalMessage(req, "Error !", "ERR_SAVE", "");
                    res.redirect( Routes.generate( Routes.__USER_ACCOUNT, {":username" : req.user.username} ));
                }
            });
        } else {
            setFormErrors(req);
            res.redirect( Routes.generate( Routes.__USER_ACCOUNT_UPDATE, { ":username" : req.user.username} ));
        }
    } else res.redirect(Routes._HOME);
}

/*
Register a new association
 */
exports.registerAssociation = function(req, res) {
    if (req.user) res.send('you are connected, you cannot already create an association');
    else {
        if (req.form.isValid) {
            AssociationAPI.new(req, function(err, asso){
                if (asso) {
                    setModalMessage(req, "Success !", null, "Your association have been successfully created");
                    res.redirect(Routes._HOME);
                } else {
                    setModalMessage(req, "We're sorry", null, "We didn't succeeded to perform your registration, please try again or contact and administrator");
                    res.redirect(Routes._HOME);
                }
            });
        } else {
            setFormErrors(req);
            res.redirect(Routes._ASSOCIATION_REGISTER);
        }
    }
}


////////////////
// OTHERS
////////////////

function setModalMessage(req,title,lead,body) {
    req.flash('type', "modal");
    if (title !== null) req.flash('title', title);
    if (lead !== null) req.flash('lead', lead);
    if (body !== null) req.flash('body', body);
}

function setFormErrors(req) {
    req.flash('type', "form-errors");
    if (req.form.errors) req.flash('errors', parseFormErrors(req.form.errors));
}

function parseFormErrors(errorsArr) {
    var errors = {},
        error;
    for (var i= 0; i<errorsArr.length; i=i+1) {
        error = errorsArr[i].split(':');
        errors[error[0]] = error[1];
    }
    return errors;
}

////////////////////
// TESTING PURPOSES
////////////////////

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