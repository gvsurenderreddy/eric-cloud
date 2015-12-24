var fs = require('fs');
var path = require('path');
var os = require('os');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login and signup) ===
    // =====================================
    app.get('/', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('index.ejs', { message: req.flash('message') });
    });


    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // DASHBOARD SECTION ===================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/dash', isLoggedIn, function(req, res) {
        res.render('dash.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // SIGN UP LOG IN ======================
    // =====================================

     // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/dash', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/dash', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // UPLOAD ==============================
    // =====================================

    app.post('/upload', isLoggedIn, function(req, res) {
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            if (filename != '') { //do nothing if there is no file
                console.log("Uploading: " + filename); 
                req.user.files.push(filename);
                req.user.save();

                var dirname  = path.dirname(__dirname);
                var uploadPath = path.join(dirname, 'uploads', req.user.local.email, filename);
                fstream = fs.createWriteStream(uploadPath);
                file.pipe(fstream);
                fstream.on('close', function () {
                    res.redirect('back');
                });
            }
        });
    });

    // =====================================
    // DOWNLOAD ============================
    // =====================================

    app.get('/download/', function(req, res) {
        // render the page and pass in any flash data if it exists
        console.log('merf');
        console.log(req.body);
        //res.render('index.ejs', { message: req.flash('message') });
    });
    app.post('/download', function(req, res) {
        // render the page and pass in any flash data if it exists
        console.log('merf2');
        console.log(req.body);
        //res.render('index.ejs', { message: req.flash('message') });
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}