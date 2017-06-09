(function(){
    var app = angular.module("finderApp");
    app.service("spotifyService", spotifyService);
    spotifyService.$inject = $inject = ['$http'];

    function spotifyService($http) {
        var service = this;
        var base_url = "https://api.spotify.com/";

        service.getTracks = function(token){
            var req = {
                method: 'GET',
                url: base_url + 'v1/me/tracks',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };

            return $http(req);
        }

        service.getArtists = function(token) {
            var data = {
                access_key: token
            };

            return $http.post('/spotify/artists', data);
        }

        service.getTracks
    }
})();