define(['controllers/module'], function(controllers) {
	controllers.controller('aboutController', aboutControllerFunc);

	function aboutControllerFunc() {
		this.awesomeThings = [
	      'HTML5 Boilerplate',
	      'AngularJS',
	      'Karma'
	    ];
	}
})
