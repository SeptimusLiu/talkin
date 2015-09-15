define(['controllers/module'], function(controllers) {
	controllers.controller('indexController', indexControllerFunc);
	indexControllerFunc.$inject = ['$scope', 'socketService'];

	function indexControllerFunc($scope, socketService) {
		$scope.messages = [];
		$scope.rooms = [
			{ name: 'Room 1', active: true },
			{ name: 'Room 2' },
			{ name: 'Room 3' }
		];
		$scope.whisperers = [
			{ name: 'User 1', active: true },
			{ name: 'User 2' }
		]
		socketService.on('messages.read', function (messages) {
			$scope.messages = messages;
		});

		socketService.on('messages.add', function (message) {
			$scope.messages.push(message);
		});

		socketService.emit('messages.read');

		$scope.sendMessage = function () {
			socketService.emit('messages.create', $scope.message);
			$scope.message = '';
		}
	}
})