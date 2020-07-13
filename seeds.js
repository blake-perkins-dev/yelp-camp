const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
 
const seeds = [
    {
        name: "Cloud's Rest",
		price: 5.50,
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
		createdAt: new Date("06/20/2020 04:11"),
        author:{
            id : "5f0c820f63a987133ebc9994",
            username: "blake_perkins"
        }
    },
    {
        name: "Desert Mesa",
		price: 7.00,
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
		createdAt: new Date("07/08/2020 04:11"),
        author:{
            id : "5f0c820f63a987133ebc9994",
            username: "blake_perkins"
        }
    },
    {
        name: "Canyon Floor",
		price: 3.25,
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
		createdAt: new Date("06/29/2020 04:11"),
        author:{
            id : "5f0c820f63a987133ebc9994",
            username: "blake_perkins"
        }
    }
]
 
async function seedDB(){
	try {
		await Campground.deleteMany({});
		// console.log("removed campgrounds!");
		await Comment.deleteMany({});
		// console.log("removed comments!");
		
		for (const seed of seeds) {
			let campground = await Campground.create(seed);
			// console.log("added a campground");
			let comment = await Comment.create (
				{
					text: "This place is great, but I wish there was internet",
					createdAt: new Date("07/09/2020 04:11"),
					author:{
						id : "588c2e092403d111454fff76",
						username: "Jack"
					}
				}
			)
			// console.log("Created new comment");
			campground.comments.push(comment);
            campground.save();
            // console.log("Comment added to campground");
		}
	} catch(err) {
		console.log(err);
	}
}
 
module.exports = seedDB;