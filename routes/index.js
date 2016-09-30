var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (!req.session.email) {
		res.redirect("/auth/login");
	}
	else {
		var users = [];

		if (req.session.email == "anupam@turret.in") {
			users = [{
				name: "Probal Basak",
				email: "probal@turret.in",
				userid: "2"
			}]
		}
		else if (req.session.email == "probal@turret.in") {
			users = [{
				name: "Anupam Basak",
				email: "anupam@turret.in",
				userid: "1"
			}]
		}

		res.render('index', {
			user: {
				email: req.session.email,
				name: req.session.name,
				userid: req.session.userid
			},
			chats: {
				users: users
			}
		});
	}
});

module.exports = router;
