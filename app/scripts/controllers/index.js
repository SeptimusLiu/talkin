define(['controllers/module'], function(controllers) {
	controllers.controller('indexController', indexControllerFunc);
	indexControllerFunc.$inject = ['$scope', 'socketService'];

	function indexControllerFunc($scope, socketService) {
		
	}
})