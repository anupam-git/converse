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
  User.findOne({
		email: req.body.e,
		password: req.body.p
	}, function(err, user) {
		if (err) {
			next(err)
		}
		else {
			if (user === null) {
				var error = new Error("Authentication Error");
				error.status = 550;

				next(error);
			}
			else {
				req.session.email = req.body.e;
				req.session.name = user.name;
				req.session.userid = user._id;
				res.redirect("/");
			}
		}
	})
});

/**
* Logout User
**/
router.get("/logout", function(req, res, next) {
  res.render("login");
});


module.exports = router;
