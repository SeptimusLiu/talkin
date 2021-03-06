define(['controllers/module'], function(controllers) {
	controllers.controller('mainController', mainControllerFunc);
	mainControllerFunc.$inject = ['$scope', '$q', '$timeout', 'channelService', 'socketService', 'messageService', 'userService', '$state', '$cookieStore', '$modal', 'getUserPromise'];

	function mainControllerFunc($scope, $q, $timeout, channelService, socketService, messageService, userService, $state, $cookieStore, $modal, getUserPromise) {
		var vm = this;
		vm.user = {};
		if (!(vm.user = getUserPromise)) {
			$state.go('login');
			return;
		}
		
		vm.messages =[];
	 	vm.channels = [];
	 	vm.notifications = [];

		vm.sendMessage = sendMessageFunc;
		vm.openModal = openModalFunc;
		vm.getMessages = getMessagesFunc;
		vm.removeMessage = removeMessageFunc;
		vm.notified = notifiedFunc;

		userService.listenUser(function (userList) {
			vm.users = userList;
		});

		userService.getOnlineUsers(function (userList) {
			vm.users = userList;
		});
		/**
		 * Add a listener for message removing event.
		 */
		messageService.listenMessage(function (messageList) {
			_updateMessageList(messageList);
		});

		messageService.listenNotification(function (notification) {
			vm.notifications.push(notification);
			(function (index) {
				$timeout((function () {
					vm.notifications.splice(index, 1);
				}), 2000);
			})(vm.notifications.length - 1);
			console.log(JSON.stringify(notification));
		});

		messageService.recvMessage(function (messageItem) {
			if (messageItem) {
				var index = _getTagIndexById(vm.channels, messageItem.channel_id);
				if (index == _getActiveTag(vm.channels)) {
					vm.messages.push(messageItem.message);
				}
			}			
		});

		function getMessagesFunc(channelId) {
			messageService.getMessages(channelId).then(function (messageList) {
				_updateMessageList(messageList);
			});
		}

		function sendMessageFunc() {
			// Construct message packet.
			// TODO: Validate each field value.
			var activeIndex = _getActiveTag(vm.channels);
			if (activeIndex != -1 && vm.channels[activeIndex].id) {
				var packet = {
					channel_id: vm.channels[activeIndex].id,
					user_id: vm.user.id,
					user_name: vm.user.name,
					content: vm.message
				};
				messageService.sendMessage(packet);
				vm.message = '';
			} else {
				alert('Please choose a channel first.');
			}
		}

		function removeMessageFunc(channelId, messsageId) {
			var packet = {
				channel_id:  vm.channels[_getActiveTag(vm.channels)].id,
				message_id: messsageId
			};
			messageService.removeMessage(packet);
		}

		/**
		 * Common open method for modals
		 * @param  {modalName[String]}
		 */
		function openModalFunc(modalName) {
			var modalInstance = $modal.open({
				templateUrl: '/scripts/partial/' + modalName + '.html',
				controller: 'modalController',
				resolve: {
					// Get channel list before modal open.
					channels: function () {
						return channelService.getChannels()
							.then(function (channels) {
								return channels;
							});
						}
				}
			});
			
			modalInstance.result.then(function (result) {
				// If channelName is provided, then ask for creating channel, or join an existing channel.
				socketService.emit('channel:join', result, function (channel) {
					if (channel && !_hasDupChannel(channel)) {
						vm.channels.push(channel);
						_setActiveTag(vm.channels, channel.id);
						getMessagesFunc(channel.id);
					}
				});
			}, function () {

			});
		}

		function notifiedFunc(index) {
			vm.notifications.splice(index, 1);
		}

		function _updateMessageList(messageList) {
			if (messageList) {
				var index = _getTagIndexById(vm.channels, messageList.channel_id);
				if (index == _getActiveTag(vm.channels)) {
					vm.messages = messageList.messages ? messageList.messages : [];
				}
			}
		}

		function _hasDupChannel(channelItem) {
			var flag = false;
			angular.forEach(vm.channels, function (channel) {
				if (channel.id == channelItem.id) {
					flag = true;
				}
			});
			return flag;
		}

		function _setActiveTag(tags, id) {
			angular.forEach(tags, function(item) {
				item.active = false;
				if (item.id == id)
					item.active = true;
			});
		}

		function _getActiveTag(tags) {
			var activeIndex = -1;
			angular.forEach(tags, function(item, index) {
				if (item.active)
					activeIndex = index;
			});
			return activeIndex;
		}

		function _getTagIndexById(tags, id) {
			var resIndex = -1;
			angular.forEach(tags, function(item, index) {
				if (item.id == id)
					resIndex = index;
			});
			return resIndex;
		}
	}
})
