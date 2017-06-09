(function(){
    var app = angular.module("finderApp");
    app.service("spotifyLoginService", spotifyLoginService);
    spotifyLoginService.$inject = $inject = ['$http'];

    function spotifyLoginService($http) {
        var service = this;

        service.login = function(){
            return $http.get('/spotify/login');
        }
    }
})();