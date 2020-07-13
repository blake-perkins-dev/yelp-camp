const express = require("express"),
	  router = express.Router({mergeParams: true});

const Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  middleware = require("../middleware");

//NEW - show form to create new comment for campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});

//CREATE - add new comment to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err) {
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					
					foundCampground.comments.push(comment);
					foundCampground.save();
					req.flash("success", "Comment added successfully!");
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			});
		}
	});
});

//EDIT - edit selected comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(err || !foundCampground) {
			req.flash("error", "Campground not found!");
			res.redirect("back");
		}
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err || !foundComment) {
				req.flash("error", "Comment not found!");
				res.redirect("back");
			} else {
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
});

//UPDATE - update selected comment
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err) {
			req.flash("error", "Comment not found!");
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY - remove selected comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err, removedComment) => {
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted successfully!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;