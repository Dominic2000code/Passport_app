const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load user model
const User = require("../models/User");

module.exports = (passport) => {
	passport.use(
		new LocalStrategy(
			{ usernameField: "email" },
			(email, password, done) => {
				//Match User
				User.findOne({ email: email })
					.then((user) => {
						if (!user) {
							return done(null, false, {
								message: "This email is not registered",
							});
						}

						//Match password
						bcrypt.compare(
							password,
							user.password,
							(error, isMatch) => {
								if (error) throw error;
								if (isMatch) {
									return done(null, user);
								} else {
									return done(null, false, {
										message: "Invalid Password",
									});
								}
							}
						);
					})
					.catch((err) => console.log(err));
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
};
