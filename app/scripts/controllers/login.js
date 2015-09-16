define(['controllers/module'], function(controllers) {
	controllers.controller('loginController', loginControllerFunc);
	loginControllerFunc.$inject = ['$scope', 'socketService'];

	function loginControllerFunc($scope, socketService) {
		var vm = this;

		vm.submit = function () {
			socketService.emit('users.add', vm.message);

			socketService.on('users.add', function (messages) {
				// TODO: add to cookie
				

			});
		}
	}
})