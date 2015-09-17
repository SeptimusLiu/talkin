define(['controllers/module'], function(controllers) {
	controllers.controller('mainController', mainControllerFunc);
	mainControllerFunc.$inject = ['$scope', '$q', 'channelService', 'socketService', '$state', '$cookieStore', '$modal', 'getUserPromise'];

	function mainControllerFunc($scope, $q, channelService, socketService, $state, $cookieStore, $modal, getUserPromise) {
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
		]

		socketService.on('message:read', function (messages) {
			vm.messages = messages;
		});

		socketService.on('message:add', function (message) {
			vm.messages.push(message);
		});

		socketService.on('channel:get', function (channels) {
			angular.forEach(channels, function(v, k) {
				vm.channelsAll.push({ id: k, name: v });
			});
		});

		socketService.emit('message:read');
		

		vm.sendMessage = sendMessageFunc;

		vm.openModal = openModalFunc;

		function sendMessageFunc() {
			socketService.emit('message:send', vm.message);
			vm.message = '';
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
	}
})
