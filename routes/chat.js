var express = require('express'),
		router = express.Router(),
		PubNub = require('pubnub'),
	 	pubnub = new PubNub({
			publishKey: "pub-c-2e9cb451-e0f7-4800-a6d0-6267c7319336",
			subscribeKey: "sub-c-0f135c70-8693-11e6-b8cb-02ee2ddab7fe"
		})

router.post("/send", function(req, res) { 

})
