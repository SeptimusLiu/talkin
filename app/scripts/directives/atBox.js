define(['directives/module'], function(directives) {
	directives.directive('atBox', atBoxFunc);
	atBoxFunc.$inject = ['$compile'];

	function atBoxFunc($compile) {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function (scope, element, attrs) {
				var users = [];
				var template = '<div class="popover top fade in" style="display: block; top: -50px; left: 0; width: 73.7344px; height: 62px;">\
  											<div class="arrow"></div><div class="popover-inner">\
  											<div class="popover-content"><div class="talkin-option-wrapper">\
												<ul>\
													<li ng-repeat="item in mainCtrl.users"><a href="javascript:;">{{item.name}}</a></li>\
												</ul></div></div></div></div>';
				
				scope.$watch(attrs.ngModel, function (value) {
					element.siblings('.popover').remove();
					if (value && value.charAt(value.length - 1) == '@') {
						console.log('@');
						element.before(template);
						$compile(element.contents())(scope);
					}
				});
			}
		}
	}
})