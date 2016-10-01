// var mongoose = require("mongoose");
//
// var User = new mongoose.Schema({
// 	name: {
// 		type: String,
//     required: true,
//     trim: true
// 	},
// 	password: String,
//   email: {
//     type: String,
//     required: true,
//     trim: true
//   }
// })
//
// module.exports = mongoose.model('User', User, "user");

var mysql = require('mysql');

module.exports.authUser = function(email, password, cb) {
	var connection = mysql.createConnection({
	  host: "us-cdbr-iron-east-04.cleardb.net",
	  user: "b0c0e0e3cbf854",
	  password: "80204659",
	  database: "ad_a78324483943ab4",
	  debug: true
	});

	connection.query('SELECT * FROM users WHERE email="'+email+'" AND password="'+password+'"', function(err, rows, fields) {
	  if (err) throw err;

	  return cb(rows[0]);
	});
}
