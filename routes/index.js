const express = require("express"),
	  router = express.Router();

const passport = require("passport"),
	  User = require("../models/user");

//ROOT ROUTE
router.get("/", function(req, res) {
	res.render("landing");
});

//==================
// AUTH ROUTES
//==================

//REGISTER FORM
router.get("/register", function(req, res) {
	res.render("register", {page: "register"});
});

//REGISTER to DB
router.post("/register", function(req, res) {
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if(err) {
			req.flash("error", err.message);
			res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
			res.redirect("/campgrounds");
		});
	});
});

//LOGIN FORM
router.get("/login", function(req, res) {
	res.render("login", {page: "login"});
});

//LOGIN - check against DB
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res) {
});

//LOGOUT
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;