define([
	'angular',
	'app',
	'controllers/_base',
	'states/_base'
], function(angular) {
	'use strict';
	angular.element(document).ready(function() {
		angular.bootstrap(document, ['talkinApp']);
	});
});