define(['services/module'], function (serviceModule) {
    serviceModule.factory('socketService', socketServiceFunc);
    socketServiceFunc.$inject = ['$rootScope'];

    function socketServiceFunc($rootScope) {
      var socket = io();
      var socketListeners = {
        on: function(eventName, callback) {
          socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            })
          });
        },
        emit: function (eventName, data, callback) {
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            })
          });
        }
      }

      return socketListeners;
    }
})
