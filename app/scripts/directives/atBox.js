define(['directives/module'], function(directives) {
	directives.directive('atBox', atBoxFunc);

	function atBoxFunc() {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function (scope, element, attrs) {
				
				scope.$watch(attrs.ngModel, function (value) {
					if (value && value.charAt[value.length - 1] == '@') {
						console.log(items[0]);
					}
				});
			}
		}
	}
})