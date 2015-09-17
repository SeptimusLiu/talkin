define(['services/module'], function (serviceModule) {
    serviceModule.factory('channelService', channelServiceFunc);
    channelServiceFunc.$inject = ['$q', 'socketService',];

    /**
     * Service for channel add and get
     */
    function channelServiceFunc($q, socketService) {   
      var services = {
        getChannels: function () {
          var deferred = $q.defer();
          var channelsAll = [];

          socketService.emit('channel:get', '', function (channels) {
            angular.forEach(channels, function(v, k) {
              channelsAll.push({ id: k, name: v });
            });
            deferred.resolve(channelsAll);
          });
          
          return deferred.promise;
        }
      };

      return services;
    }
})
