var express = require('express'),
		router = express.Router(),
		PubNub = require('pubnub'),
	 	pubnub = new PubNub({
			publishKey: "pub-c-2e9cb451-e0f7-4800-a6d0-6267c7319336",
			subscribeKey: "sub-c-0f135c70-8693-11e6-b8cb-02ee2ddab7fe"
		});

/**
* Send Chat to User
**/
router.post("/send", function(req, res) {
	pubnub.publish({
    channel : req.body.to,
    message : {
			data: req.body.message,
			senderName: req.body.senderName,
			sender: req.body.sender
		}
	}, function(status, response) {
		res.json({
			status: "success",
			response: response
		})
  })
})

module.exports = router;
