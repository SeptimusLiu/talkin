define(['states/module'],
  function (stateModule) {
    stateModule.config(
      ['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
          $urlRouterProvider
            .otherwise('/main');

          $stateProvider
            .state("main", {
              url: "/main",
              controller: 'mainController as mainCtrl',
              templateUrl: 'views/main.html'
            })
            // .state("main.user", {
            //   url: "/user",
            //   controller: "userController as userCtrl",
            //   templateUrl: 'views/about.html'
            // })
        }])
  })
