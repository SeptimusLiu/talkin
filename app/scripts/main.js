;(function(){
	require.config({
		paths: {
			'jquery': '../bower_components/jquery/dist/jquery.min',
			'angular': '../bower_components/angular/angular.min',
			'ui.router': '../bower_components/angular-ui-router/release/angular-ui-router.min',
			'ui.bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap.min',
			'app': 'app',
			// 'socket.io': '../bower_components/socket.io-client/socket.io',
			'bootstrap': 'bootstrap'
		},
		shim: {
			'jquery': {
				exports: 'jquery'
			},
			'angular': {
				deps: ['jquery'],
				exports: 'angular'
			},
			'ui.router': {
				deps: ['angular']
			},
			'ui.bootstrap': {
				deps: ['angular']
			}
		}
	});
}());