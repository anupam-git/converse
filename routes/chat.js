var express = require('express'),
		router = express.Router(),
		LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2'),
		language_translator = new LanguageTranslatorV2({
		  "url": "https://gateway.watsonplatform.net/language-translator/api",
		  "password": "ZmCtL2EjeoEG",
		  "username": "14850478-d6a4-4d31-a12c-b0bed623dedb"
		}),
		PubNub = require('pubnub'),
	 	pubnub = new PubNub({
			publishKey: "pub-c-2e9cb451-e0f7-4800-a6d0-6267c7319336",
			subscribeKey: "sub-c-0f135c70-8693-11e6-b8cb-02ee2ddab7fe"
		});

/**
* Send Chat to User
**/
router.post("/send", function(req, res) {
	language_translator.identify({
		text: req.body.message
	}, function(err, identifiedLanguages) {
    if (err)
      console.log(err)
    else {
			if (identifiedLanguages.languages[0].language !== "en") {
				language_translator.translate({
			    text: req.body.message+"",
					source: identifiedLanguages.languages[0].language,
			    target: 'en'
			  }, function(err, translation) {console.log(translation);
			    if (err) {
			      console.log(err)
					}
			    else {
						pubnub.publish({
					    channel : req.body.to,
					    message : {
								data: translation.translations.translation,
								dataOriginal: req.body.message,
								senderName: req.body.senderName,
								sender: req.body.sender
							}
						}, function(status, response) {
							res.json({
								status: "success",
								response: response
							})
					  })
					}
				})
			}
			else {
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
			}
		}
	});
})

module.exports = router;
