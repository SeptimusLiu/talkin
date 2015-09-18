define(['services/module'], function (serviceModule) {
    serviceModule.factory('userService', userServiceFunc);
    userServiceFunc.$inject = ['$q', '$cookieStore', 'socketService',];

    /**
     * Service for login validation
     */
    function userServiceFunc($q, $cookieStore, socketService) {   
      var services = {
        listenUser: function (callback) {
          socketService.on('user:get', callback);
        },

        addUser: function (user) {
          var deferred = $q.defer();
          if (user) {
            // Send user info to server, if it existed, update it, or add a new one.
            socketService.emit('user:add', user, function (userItem) {
              // Fetch user info from server, and save it to cookie/
              $cookieStore.put('user', userItem);
              deferred.resolve();
            });
          } else {
            deferred.reject('Failed to login');
          }
          
          return deferred.promise;
        },

        getUser: function () {
          var deferred = $q.defer();

          var user = $cookieStore.get('user');
          if (user) {
            // Send user info saved in cookie, if it doesn't exist in server, then add it/
            socketService.emit('user:add', user, function (userItem) {
              $cookieStore.put('user', userItem);
              deferred.resolve(userItem); // Send user info to main controller.
            });
          } else {
            deferred.reject('Failed to get user info');
          }
          
          return deferred.promise;
        },

        getOnlineUsers: function (callback) {
          socketService.emit('user:get', '', callback);
        }
      };

      return services;
    }
})
