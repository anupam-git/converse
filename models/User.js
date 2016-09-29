var mongoose = require("mongoose");

var User = new mongoose.Schema({
	name: {
		type: String,
    required: true,
    trim: true
	},
	password: String,
  email: {
    type: String,
    required: true,
    trim: true
  }
})

module.exports = mongoose.model('User', User, "user");
