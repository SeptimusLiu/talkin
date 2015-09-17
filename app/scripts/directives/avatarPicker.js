define(['directives/module'], function(directives) {
	directives.directive('avatarPicker', avatarPickerFunc);

	function avatarPickerFunc() {
		return {
			restrict: 'A',
			replace: true,
			scope: {
				picked: '='
			},
			templateUrl: 'scripts/partial/avatarPicker.html',
			link: function (scope, element, attrs) {
				scope.items = [];
				for(var i = 0; i < 9; i++) {
					scope.items.push(i);
				}
			}
		}
	}
})