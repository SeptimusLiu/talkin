define(['directives/module'], function(directives) {
	directives.directive('atBox', atBoxFunc);
	atBoxFunc.$inject = ['$compile'];

	function atBoxFunc($compile) {
		return {
			replace: true,
			restrict: 'A',
			scope: {
				'items': '=',
				'message': '=',
				'send': '&'	
			},
			templateUrl: 'scripts/partial/atBox.html',
			link: function (scope, element, attrs) {
				var template = '<div class="popover top fade in" style="display: block; top: -50px; left: 0;">\
  											<div class="arrow"></div><div class="popover-inner">\
  											<div class="popover-content"><div class="talkin-option-wrapper">\
												<ul><li ng-repeat="item in items track by $index"><a ng-click="atUser($index);" href="javascript:;">{{ item.name }}({{ item.id }})</a></li>\
												</ul></div></div></div></div>';
				
				scope.$watch('message', function (newVal, oldVal) {
					element.find('.popover').remove();
					if (newVal !== oldVal && newVal.charAt(newVal.length - 1) == '@') {
						console.log('@');
						element.prepend(template);
						$compile(element.find('.popover').contents())(scope);
					}
				});

				scope.atUser = function (index) {
					element.find('.popover').remove();
					if (scope.items[index]) {
						scope.message += scope.items[index].name + '[' + scope.items[index].id + '];';
						element.find('textarea').focus();
					}
				}
			}
		}
	}
})