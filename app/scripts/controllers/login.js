define(['controllers/module'], function(controllers) {
	controllers.controller('loginController', loginControllerFunc);
	loginControllerFunc.$inject = ['$scope', 'socketService'];

	function loginControllerFunc($scope, socketService) {
		var vm = this;
	}
})