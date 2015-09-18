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
                getUserPromise: ['userService', function (userService) {
                  return userService.getUser()
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
