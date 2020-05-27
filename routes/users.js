const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//User model
const User = require("../models/User");

//Login page
router.get("/login", (req, res) => {
	res.render("login");
});

//Register page
router.get("/register", (req, res) => {
	res.render("register");
});

//Registration Post Handler
router.post("/register", (req, res) => {
	const { name, email, password, password2 } = req.body;
	let errors = [];

	//Check required fields
	if (!name || !email || !password || !password2) {
		errors.push({ msg: "Please fill in all fields" });
	}

	if (password !== password2) {
		errors.push({ msg: "Passwords do not match" });
	}

	//Check password length
	if (password.length < 6) {
		errors.push({ msg: "Password must be at least 6 characters long" });
	}

	if (errors.length > 0) {
		res.render("register", {
			errors,
			name,
			email,
			password,
			password2,
		});
	} else {
		//validating user
		User.findOne({ email: email }).then((user) => {
			if (user) {
				// if User exist
				errors.push({ msg: "Email already exist" });
				res.render("register", {
					errors,
					name,
					email,
					password,
					password2,
				});
			} else {
				const newUser = new User({
					name,
					email,
					password,
				});

				//Hashing Password
				bcrypt.genSalt(10, (error, salt) =>
					bcrypt.hash(newUser.password, salt, (error, hash) => {
						if (error) throw error;

						//setting password to hash
						newUser.password = hash;

						//save user
						newUser
							.save()
							.then((user) => {
								req.flash(
									"success_msg",
									"You are now registered and can now sign in"
								);
								res.redirect("/users/login");
								// console.log(newUser)
							})
							.catch((error) => console.log(error));
					})
				);
			}
		});
	}
});

//Login Post Handle
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/users/login",
		failureFlash: true,
	})(req, res, next);
});

// Logout Get Handle
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success_msg", "You are logged out");
	res.redirect("/users/login");
});

module.exports = router;
