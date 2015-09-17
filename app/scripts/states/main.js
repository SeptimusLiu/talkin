define(['states/module'],
  function (stateModule) {
    stateModule.config(
      ['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
          $urlRouterProvider
            .otherwise('/');

          $stateProvider
            .state("main", {
              url: "/",
              resolve: {
                getUserPromise: ['loginService', function (loginService) {
                  return loginService.getUser()
                    .then(function (userItem) {
                      return userItem;
                    }, function () {
                      return null;
                    });
                }] 
              },
              controller: 'mainController as mainCtrl',
              templateUrl: 'views/main.html'
            });
        }])
  })
