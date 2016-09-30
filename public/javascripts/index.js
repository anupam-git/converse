(function(){
  var chat = {
    messageToSend: '',
		pubnubToChannel: '',
    init: function() {
      this.cacheDOM();
      this.bindEvents();
      this.render();
    },
    cacheDOM: function() {
      this.$chatHistory = $('.chat-history');
      this.$button = $('button');
      this.$textarea = $('#message-to-send');
			this.$peopleList = $('#people-list .list');
      this.$chatHistoryList =  this.$chatHistory.find('ul');
    },
    bindEvents: function() {
      this.$button.on('click', this.addMessage.bind(this));
      this.$textarea.on('keyup', this.addMessageEnter.bind(this));

			$(document).on("mouseenter", ".analyze-tone", function(e) {
		    $(this).parent().find(".message-data-tone").show();
		  });
			$(document).on("mouseleave", ".analyze-tone", function() {
		    $(this).parent().find(".message-data-tone").hide();
		  });

			$(document).on("mousemove", ".analyze-tone", function(e) {
				var moveLeft = 20;
				var moveDown = 10;

				$(this).parent().find(".message-data-tone").css('top', e.pageY + moveDown).css('left', e.pageX + moveLeft);
			});

			_this = this;
			pubnubMessageListener = this.pubnubMessageListener;

			this.pubnub.addListener({
				message: function(m) {
					pubnubMessageListener(_this, m)
				},
				status: this.pubnubStatusListener
			})
			this.pubnub.subscribe({
				channels: pubnubFromChannels
			})
    },
    render: function() {
      this.scrollToBottom();
      if (this.messageToSend.trim() !== '') {
        var template = Handlebars.compile( $("#message-template").html());
        var context = {
          messageOutput: this.messageToSend,
					senderName: senderName,
          time: this.getCurrentTime()
        };
				var toLang = this.$peopleList.find(".active").attr("data-lang");

        this.$chatHistoryList.append(template(context));
        this.scrollToBottom();
        this.$textarea.val('');

				this.sendChatToServer(this.messageToSend, senderName, toLang);
				this.messageToSend = "";
      }
    },

    addMessage: function() {
      this.messageToSend = this.$textarea.val();
			this.pubnubToChannel = this.$peopleList.find(".active").attr("data-pubnub-channel");
      this.render();
    },
    addMessageEnter: function(event) {
        // enter was pressed
        if (event.keyCode === 13) {
          this.addMessage();
        }
    },
    scrollToBottom: function() {
       this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
    },
    getCurrentTime: function() {
      return new Date().toLocaleTimeString().
              replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    },
    getRandomItem: function(arr) {
      return arr[Math.floor(Math.random()*arr.length)];
    },
		sendChatToServer: function(message, senderName, toLang) {
			$.ajax({
				method: "post",
				url: "/chat/send",
				data: {
					to: this.pubnubToChannel,
					message: message,
					fromLang: userLang,
					toLang: toLang,
					sender: sender,
					senderName: senderName
				}
			})
		},
		pubnub: new PubNub({
			publishKey: "pub-c-2e9cb451-e0f7-4800-a6d0-6267c7319336",
			subscribeKey: "sub-c-0f135c70-8693-11e6-b8cb-02ee2ddab7fe"
		}),
		pubnubStatusListener: function(s) {
			console.log("PubNub Status Listener : "+JSON.stringify(s));
		},
		pubnubMessageListener: function(_this, m) {
			var channelName = m.actualChannel;
			var channelGroup = m.subscribedChannel;
			var pubTT = m.timetoken;
			var msg = m.message;

			if (msg.sender !== sender) {
				var templateResponse = Handlebars.compile( $("#message-response-template").html());
				var contextResponse = {
					senderName: msg.senderName,
					time: _this.getCurrentTime(),
					message: msg.data,
					emotion: msg.emotion
				};

				console.log(msg.emotion);

				_this.$chatHistoryList.append(templateResponse(contextResponse));
				_this.scrollToBottom();
			}
		}
  };

  chat.init();

  var searchFilter = {
    options: { valueNames: ['name'] },
    init: function() {
      var userList = new List('people-list', this.options);
      var noItems = $('<li id="no-items-found">No items found</li>');

      userList.on('updated', function(list) {
        if (list.matchingItems.length === 0) {
          $(list.list).append(noItems);
        } else {
          noItems.detach();
        }
      });
    }
  };

  searchFilter.init();

})();
