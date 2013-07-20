///////////////
// Controllers
///////////////

// Use the user API to add, modify, update or delete user
var mongoose;
var UserAPI;
var City;
var School;
var AssociationAPI;
var Routes;
exports.init = function(dataProvider, routes) {
    mongoose = dataProvider;
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
        //setModalMessage(req, null, null, 'test');
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
    else res.redirect(Routes._ROOT);
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
    } else res.redirect(Routes._ROOT);
    //AssociationAPI.populate("51e9edc56b3396921e000001");
}

/*
User page
  */
exports.showUserDashboard = function(req, res) {
    if (req.user) {
        //setModalMessage(req, "Welcome !", null, "WELCOME ON YOUR TIMELINE");
        res.render('user-dashboard');
    }
    else res.redirect(Routes._ROOT);
}

/*
User modification page
  */
exports.showUserAccount = function(req, res) {
    if (req.user) City.find({}).ne('_id', req.user.city).exec( function(err, cities) {
        if (cities) City.findOne({ '_id': req.user.city }, function(err, userCity) {
            res.render('user-update', { cities : cities,
                                        userCity : userCity });
        });
    });
    else res.redirect(Routes._ROOT);
}

/////////////
// Functions
/////////////   

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
    res.redirect(Routes._ROOT);
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
    if (!req.user)
        if (req.form.isValid) {
            UserAPI.new(req);
            setModalMessage(req, "Success !", null, "Your account have been successfully created !");
            res.redirect(Routes._ROOT);

        // If the form is not valid
        } else  res.redirect(Routes._REGISTER);

    /*
     If a user is logged in, we redirect
     */
    else res.redirect(Routes._ROOT);
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
            res.redirect(Routes.generate( Routes.__USERNAME_ACCOUNT, {":username" : req.user.username} ));
        } else {
            setFormErrors(req);
            res.redirect(Routes.generate( Routes.__USERNAME_ACCOUNT, {":username" : req.user.username} ));
        }
    else res.redirect(Routes._ROOT);
}

/*
Register a new association
 */
exports.registerAssociation = function(req, res) {
    if (req.user) res.render('you are connected, you cannot already create an association');
    else {
        if (req.form.isValid) {
            var asso = AssociationAPI.new(req)
            if (asso)
                setModalMessage(req, "Success !", null, "Your association have been successfully created");
            res.redirect(Routes._ROOT);
        } else {
            setFormErrors(req);
            res.redirect(Routes._REGISTER_ASSOCIATION);
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