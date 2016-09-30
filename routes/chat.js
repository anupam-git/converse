var express = require('express'),
		router = express.Router(),
		LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2'),
		ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3'),
		languageTranslator = new LanguageTranslatorV2({
		  "url": "https://gateway.watsonplatform.net/language-translator/api",
		  "password": "ZmCtL2EjeoEG",
		  "username": "14850478-d6a4-4d31-a12c-b0bed623dedb"
		}),
		toneAnalyzer = new ToneAnalyzerV3({
		  "url": "https://gateway.watsonplatform.net/tone-analyzer/api",
		  "password": "I1qhkF25LuS7",
		  "username": "b11ef070-d8fb-407e-af51-b739b2ab5c57",
			"version_date": "2016-05-19"
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
	var data = "",
			toneAnalyzeText = req.body.message;

	if (req.body.fromLang !== req.body.toLang) {
		languageTranslator.translate({
	    text: req.body.message,
			source: req.body.fromLang,
	    target: req.body.toLang
	  }, function(err, translation) {
	    if (err) {
	      console.log(err)
			}
	    else {
				data = translation.translations[0].translation

				if (req.body.toLang == 'en') {
					toneAnalyzeText = translation.translations[0].translation
				}

				sendResponse();
			}
		})
	}
	else {
		data = req.body.message;

		sendResponse();
	}

	function sendResponse() {
		console.log("Analyze tone : "+toneAnalyzeText);

		toneAnalyzer.tone({
			text: toneAnalyzeText,
			tones: "emotion"
		}, function(err, tone) {
			if (err)
	      console.log(err);
	    else {
	      // console.log(JSON.stringify(tone.document_tone.tone_categories, null, 2));

				var emotions = tone.document_tone.tone_categories[0];
				var emotion = {};

				for (i in emotions.tones) {
					emotion[emotions.tones[i].tone_id] = ~~(emotions.tones[i].score*100);
				}

				pubnub.publish({
					channel : req.body.to,
					message : {
						data: data,
						dataOriginal: req.body.message,
						senderName: req.body.senderName,
						sender: req.body.sender,
						emotion: emotion
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
})

module.exports = router;
