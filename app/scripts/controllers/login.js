define(['controllers/module'], function(controllers) {
	controllers.controller('loginController', loginControllerFunc);
	loginControllerFunc.$inject = ['$scope', '$state', '$cookieStore', 'loginService'];

	function loginControllerFunc($scope, $state, $cookieStore, loginService) {
		var vm = this;
		vm.picked = 0;
		vm.loginForm = {};

		vm.login = function () {
			var user_id = 0;
			if ($cookieStore.get('user')) {
				// If user existed in cookie, then just update its name.
				user_id = $cookieStore.get('user').id;
			}
			var user = {
				name: vm.loginForm.nickname,
				id: user_id,
				avatar_id: vm.picked
			};
			loginService.addUser(user).then(function (userItem) {
				console.log(userItem);
				$state.go('main');
			}, function (e) {
				alert(e);
			});
		}
	}
})