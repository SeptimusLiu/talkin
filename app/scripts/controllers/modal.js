define(['controllers/module'], function(controllers) {
	controllers.controller('modalController', modalControllerFunc);
	modalControllerFunc.$inject = ['$scope', '$modalInstance', 'channels'];

	function modalControllerFunc($scope, $modalInstance, channels) {
		$scope.channels = channels;

		$scope.confirm = function (channelId) {
			var result = {
				name: $scope.channelName,
				id: channelId
			};
		    $modalInstance.close(result);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}
})