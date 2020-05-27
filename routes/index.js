const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/authenticate");

//Landing Page
router.get("/", (req, res) => {
	res.render("welcome");
});

//DashBoard
router.get("/dashboard",ensureAuthenticated, (req, res) => {
	res.render("dashboard", {
		UserName : req.user.name
	});
});

module.exports = router;
