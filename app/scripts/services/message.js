define(['services/module'], function (serviceModule) {
    serviceModule.factory('messageService', messageServiceFunc);
    messageServiceFunc.$inject = ['$q', '$rootScope', 'socketService'];

    /**
     * Service for message send and receive
     */
    function messageServiceFunc($q, $rootScope, socketService) {   
      var services = {
        
        /**
         * Start listening to incoming message
         */
        listenMessage: function (callback) {
          socketService.on('message:get', callback);
        },

        listenNotification: function (callback) {
          socketService.on('message:notify', callback);
        },

        recvMessage: function(callback) {
          socketService.on('message:recv', callback);
        },

        getMessages: function (channelId) {
          var deferred = $q.defer();
          socketService.emit('message:get', channelId, function (messages) {
            deferred.resolve(messages);
          });
          
          return deferred.promise;
        },

        sendMessage: function (packet) {
          socketService.emit('message:send', packet);
        },

        removeMessage: function (packet) {
          socketService.emit('message:remove', packet);
        }
      };

      return services;
    }
})