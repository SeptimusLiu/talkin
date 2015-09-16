define([
	'angular',
	'app',
	// 'socket.io',
	'controllers/_base',
	'services/_base',
	'states/_base',
	'directives/_base'
], function(angular) {
	'use strict';
	angular.element(document).ready(function() {
		angular.bootstrap(document, ['talkinApp']);
	});
});