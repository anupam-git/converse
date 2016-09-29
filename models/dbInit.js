var mongo = process.env.VCAP_SERVICES;
var mongoose = require( 'mongoose' );
var dbURI = "";

if (mongo) {
  var env = JSON.parse(mongo);

	if (env['mongodb-2.4']) {
    mongo = env['mongodb-2.4'][0]['credentials'];

		if (mongo.url) {
      dbURI = mongo.url;
    }
	}
	else {
		dbURI = 'mongodb://localhost:27017/converseDB';
	}
}
else {
	dbURI = 'mongodb://localhost:27017/converseDB';
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
