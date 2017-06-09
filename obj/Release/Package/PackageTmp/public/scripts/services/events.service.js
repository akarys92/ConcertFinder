(function(){
    var app = angular.module("finderApp");
    app.service("eventService", eventService);
    eventService.$inject = $inject = ['$http'];

    function eventService($http) {
        var service = this;

        service.getEvents = function(artists) {
            var data = {
                artists: artists
            };

            return $http.post('/events/all', data);
        }
    }
})();