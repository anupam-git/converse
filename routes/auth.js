var express = require('express');
var router = express.Router();
var User = require(__basedir+"/models/User")

/**
* Return Rendered Login Page to User
**/
router.get("/login", function(req, res, next) {
  res.render("login");
});

/**
* Authenticate User
**/
router.post("/login", function(req, res, next) {
	if (req.body.e == "anupam@turret.in" && req.body.p == "password") {
		req.session.email = req.body.e;
		req.session.name = "Anupam Basak";
		req.session.userid = "1";
		req.session.lang = "es";

		res.redirect("/");
	}
	else if (req.body.e == "probal@turret.in" && req.body.p == "password") {
		req.session.email = req.body.e;
		req.session.name = "Probal Basak";
		req.session.userid = "2";
		req.session.lang = "en";

		res.redirect("/");
	}
	else {
		var error = new Error("Authentication Error");
		error.status = 550;

		next(error);
	}
});

/**
* Logout User
**/
router.get("/logout", function(req, res, next) {
	req.session.destroy();

  res.redirect("login")
});


module.exports = router;
