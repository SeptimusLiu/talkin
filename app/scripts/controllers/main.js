define(['controllers/module'], function(controllers) {
	controllers.controller('mainController', mainControllerFunc);
	mainControllerFunc.$inject = ['$scope', 'socketService', '$state', '$cookieStore', 'getUserPromise'];

	function mainControllerFunc($scope, socketService, $state, $cookieStore, getUserPromise) {
		if (!getUserPromise) {
			console.log('Enter main');
			$state.go('login');
			return;
		}

		var vm = this;
		vm.messages = [];
		vm.rooms = [
			{ name: 'Room 1', active: true },
			{ name: 'Room 2' },
			{ name: 'Room 3' }
		];
		vm.whisperers = [
			{ name: 'User 1', active: true },
			{ name: 'User 2' }
		]
		socketService.on('messages.read', function (messages) {
			vm.messages = messages;
		});

		socketService.on('messages.add', function (message) {
			vm.messages.push(message);
		});

		socketService.emit('messages.read');

		vm.sendMessage = function () {
			socketService.emit('messages.create', vm.message);
			vm.message = '';
		}
	}
})
