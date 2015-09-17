define(['directives/module'], function(directives) {
	directives.directive('nicknameValidate', nicknameValidateFunc);

	function nicknameValidateFunc() {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				scope.$watch(attrs.ngModel, function (value) {
					ctrl.$setValidity('pattern', /^[a-zA-Z0-9_]+$/.test(value));
				});
			}
		}
	}
})