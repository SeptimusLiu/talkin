define(['controllers/module'], function(controllers) {
	controllers.controller('mainController', mainControllerFunc);

	function mainControllerFunc() {
		this.awesomeThings = [
	      'HTML5 Boilerplate',
	      'AngularJS',
	      'Karma'
	    ];
	}
})
/**
 * @ngdoc function
 * @name talkinApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the talkinApp
 */
// angular.module('talkinApp')
//   .controller('MainCtrl', function () {
//     this.awesomeThings = [
//       'HTML5 Boilerplate',
//       'AngularJS',
//       'Karma'
//     ];
//   });
