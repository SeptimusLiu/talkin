define(['directives/module'], function(directives) {
	directives.directive('channelList', channelListFunc);

	function channelListFunc() {
		return {
			scope: {
				
			},
			link: function (scope, element, attrs, ctrl) {
				scope.$watch(attrs.ngModel, function (value) {
					ctrl.$setValidity('pattern', /^[a-zA-Z0-9_]+$/.test(value));
				});
			}
		}
	}
})