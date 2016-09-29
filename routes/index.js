var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (!req.session.email) {
		res.redirect("/auth/login");
	}
	else {
		res.render('index', {
			user: {
				email: req.session.email,
				name: req.session.name,
				userid: req.session.userid
			}
		});
	}
});

module.exports = router;
