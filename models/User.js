var mysql = require('mysql');
var pool  = mysql.createPool({
	host: "us-cdbr-iron-east-04.cleardb.net",
	user: "b0c0e0e3cbf854",
	password: "80204659",
	database: "ad_a78324483943ab4",
	debug: true
});

module.exports.authUser = function(email, password, cb) {
	pool.getConnection(function(err, connection) {
		connection.query('SELECT * FROM users WHERE email="'+email+'" AND password="'+password+'"', function(err, rows, fields) {
		  if (err) throw err;

			connection.end();

		  return cb(rows[0]);
		});
	})
}
