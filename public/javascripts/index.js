(function(){
  var chat = {
    messageToSend: '',
		messageFrom: {
			msg: "",
			time: "",
			senderName: "",
			sender: "",
			senderChannel: ""
		},
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

        this.$chatHistoryList.append(template(context));
        this.scrollToBottom();
        this.$textarea.val('');

				this.sendChatToServer(this.messageToSend, senderName);
				this.messageToSend = "";
      }
			else if (this.messageFrom.msg.trim() !== '') {console.log("response", this.messageFrom.sender, sender);
				if (this.messageFrom.sender !== sender) {
					var templateResponse = Handlebars.compile( $("#message-response-template").html());
	        var contextResponse = {
	          senderName: this.messageFrom.senderName,
	          time: this.messageFrom.time,
						message: this.messageFrom.msg
	        };

	        this.$chatHistoryList.append(templateResponse(contextResponse));
	        this.scrollToBottom();
				}

				this.messageFrom = {
					msg: "",
					time: "",
					senderName: "",
					sender: "",
					senderChannel: ""
				};
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
		sendChatToServer: function(message, senderName) {
			$.ajax({
				method: "post",
				url: "/chat/send",
				data: {
					to: this.pubnubToChannel,
					message: message,
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

			_this.messageFrom = {
				msg: msg.data,
				time: pubTT,
				sender: msg.sender,
				senderName: msg.senderName,
				senderChannel: channelName
			}

			_this.render();
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
