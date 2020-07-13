const express = require("express"),
	  router = express.Router();

const passport = require("passport"),
	  User = require("../models/user"),
	  Campground = require("../models/campground");

//ROOT ROUTE
router.get("/", (req, res) => {
	res.render("landing");
});

//==================
// AUTH ROUTES
//==================

//REGISTER FORM
router.get("/register", (req, res) => {
	res.render("register", {page: "register"});
});

//REGISTER to DB
router.post("/register", (req, res) => {
	const newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		avatar: req.body.avatar
	});
	if(req.body.adminCode === process.env.ADMIN_SECRET) {
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, (err, user) => {
		if(err) {
			req.flash("error", err.message);
			res.redirect("/register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
			res.redirect("/campgrounds");
		});
	});
});

//LOGIN FORM
router.get("/login", (req, res) => {
	res.render("login", {page: "login"});
});

//LOGIN - check against DB
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), (req, res) => {
});

//LOGOUT
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

//USER PROFILES
router.get("/users/:id", (req,res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if(err) {
			req.flash("error", "Something went wrong!");
			res.redirect("back");
		}
		Campground.find().where("author.id").equals(foundUser._id).exec((err, campgrounds) => {
			if(err) {
			req.flash("error", "Something went wrong!");
			res.redirect("back");
			}
			res.render("users/show", {user: foundUser, campgrounds: campgrounds});
		});
	});
});

module.exports = router;