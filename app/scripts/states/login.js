define(['states/module'],
  function (stateModule) {
    stateModule.config(
      ['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
          $stateProvider
            .state("login", {
              url: "/login",
              controller: 'loginController as loginCtrl',
              templateUrl: 'views/login.html'
            });
        }])
  })
