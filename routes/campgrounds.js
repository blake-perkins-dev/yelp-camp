const express = require("express"),
	  router = express.Router();

const Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", (req, res) => {
	// Get all campgrounds from DB
	Campground.find({}, (err, allcampgrounds) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allcampgrounds, page: "campgrounds"});
		}
	});
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
	// get data from form and add to campgrounds array
	const name = req.body.name;
	const price = req.body.price;
	const image = req.body.image;
	const desc = req.body.description;
	const amen = req.body.amenities;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	const newCampground = {name: name, price: price, image: image, description: desc, amenities: amen, author: author};
	// create a new campground and save to DB
	Campground.create(newCampground, (err, newlyCreated) => {
		if(err) {
			console.log(err);
		}
		else {
			// redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new", {page: "newCampground"});
});

//SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if(err || !foundCampground){
			req.flash("error", "Campground not found!");
			res.redirect("back");
		} else {
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT - edit selected campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req,res) => {
		Campground.findById(req.params.id, (err, foundCampground) => {
			res.render("campgrounds/edit", {campground: foundCampground});
		});
});

//UPDATE - update selected campground
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err) {
			req.flash("error", "Campground not found!");
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY - remove selected campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, removedCampground) => {
		if(err) {
			req.flash("error", "Campground not found!");
			res.redirect("/campgrounds");
		}
		Comment.deleteMany( {_id: { $in: removedCampground.comments } }, (err) => {
			if(err) {
				console.log(err);
			}
			res.redirect("/campgrounds");
		});
	});
});

module.exports = router;