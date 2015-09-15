define(['controllers/module'], function(controllers) {
	controllers.controller('indexController', indexControllerFunc);
	indexControllerFunc.$inject = ['$scope', 'socketService'];

	function indexControllerFunc($scope, socketService) {
		$scope.messages = [];
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