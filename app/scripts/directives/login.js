define(['directives/module'], function(directives) {
	directives.directive('nicknameValidate', nicknameValidateFunc);

	function nicknameValidateFunc() {
		return {
			link: function (scope, element, attr) {

			}
		}
	}
})