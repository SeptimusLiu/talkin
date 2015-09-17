define(['controllers/module'], function(controllers) {
	controllers.controller('mainController', mainControllerFunc);
	mainControllerFunc.$inject = ['$scope', '$q', 'channelService', 'socketService', 'messageService', '$state', '$cookieStore', '$modal', 'getUserPromise'];

	function mainControllerFunc($scope, $q, channelService, socketService, messageService, $state, $cookieStore, $modal, getUserPromise) {
		var vm = this;
		vm.user = {};
		if (!(vm.user = getUserPromise)) {
			$state.go('login');
			return;
		}
		
		vm.messages =[];
	 	vm.channels = [];
	 	vm.channelsAll = [];
	 	vm.whisperers = [
			{ name: 'User 1', active: true },
			{ name: 'User 2' }
		];

		messageService.recvMessage(function (messageItem) {
			if (messageItem) {
				var index = _getTagIndexById(vm.channels, messageItem.channel_id);
				if (index == _getActiveTag(vm.channels)) {
					vm.messages.push(messageItem.message);
				}
			}
			
		});
		
		vm.sendMessage = sendMessageFunc;
		vm.openModal = openModalFunc;
		vm.getMessages = getMessagesFunc;

		function getMessagesFunc(channelId) {
			messageService.getMessages(channelId).then(function (messageList) {
				if (messageList) {
					var index = _getTagIndexById(vm.channels, messageList.channel_id);
					if (index == _getActiveTag(vm.channels)) {
						vm.messages = messageList.messages ? messageList.messages : [];
					}
				}
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
				if (item.id === id)
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
				if (item.id === id)
					resIndex = index;
			});
			return resIndex;
		}
	}
})
