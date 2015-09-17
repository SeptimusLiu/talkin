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

		messageService.recvMessage(function (message) {
			vm.messages.push(message);
		});
	
		// socketService.on('message:read', function (messages) {
		// 	vm.messages = messages;
		// });

		// socketService.on('message:add', function (message) {
		// 	vm.messages.push(message);
		// });
		
		vm.sendMessage = sendMessageFunc;
		vm.openModal = openModalFunc;
		vm.getMessages = getMessagesFunc;

		getMessagesFunc();

		function getMessagesFunc() {
			var activeIndex = _getActiveTag(vm.channels);
			if (activeIndex != -1 && vm.channels[activeIndex].id) {
					messageService.getMessages(vm.channels[activeIndex].id).then(function (messages) {
					vm.messages = messages ? messages : [];
				});
			}
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

		function _getActiveTag(tags) {
			var activeIndex = -1;
			angular.forEach(tags, function(item, index) {
				if (item.active)
					activeIndex = index;
			});
			return activeIndex;
		}
	}
})
