;(function(){
	require.config({
		paths: {
			'jquery': '../bower_components/jquery/dist/jquery.min',
			'angular': '../bower_components/angular/angular.min',
			'ui.router': '../bower_components/angular-ui-router/release/angular-ui-router.min',
			'app': 'app',
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
			'ui-router': {
				deps: ['angular']
			}
		}
	});
}());