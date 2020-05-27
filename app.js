const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const app = express();

//Passport config
require("./config/passport")(passport);

//Bodyparser
app.use(express.urlencoded({ extended: false }));
//Mongo Connection

mongoose
	.connect("mongodb://localhost/users", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log("MongoDB Connected...");
	})
	.catch((error) => {
		console.log(error);
	});

//EJS middleware
app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
//frontend frameworks
app.use(
	"/css",
	express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css"))
);
app.use(
	"/js",
	express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js"))
);

//Express session middleware
app.set("trust proxy", 1); // trust first proxy
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
