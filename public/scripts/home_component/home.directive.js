(function(){
    var app = angular.module("finderApp");
    app.directive("homeComp", homeComp).controller("homeCtrl", homeCtrl);
    homeCtrl.$inject = ["$scope", "$window", "$location", "spotifyService", "eventService"];

    function homeComp(){
        return {
            restrict: 'E',
            scope: {
                access_token: '=',
                //this should be 1 way bound...
                data: '=',
                update: '&'
            },
            templateUrl: 'scripts/home_component/home.view.html'
        };
    }

    function homeCtrl($scope, $window, $location, spotifyService, eventService) {
        var ARTIST_PAGING = 50;
        var artist_iter_start = 0;
        var artist_iter_end = 0;

        $scope.iter = 0;
        $scope.tracks = [];
        $scope.debug = false;
        $scope.loading = true;
        $scope.moreItems = false;
        
        $scope.logout = function() {
            $scope.update({key: "spotify_access_token", value: ""});
            $scope.update({key: "spotify_refresh_token", value: ""});
        }

        $scope.getTracks = function(){
            spotifyService.getTracks($scope.data.spotify_access_token).then(function(result){
                $scope.tracks = result.data.items;
            }, function(error){
                console.log(error);
            });
        }

        $scope.getTopArtists = function() {
            spotifyService.getArtists($scope.data.spotify_access_token).then(function(result){
                var tempArtists = result.data.artists;
                $scope.update({ "key": "artists", "value": tempArtists });
                $scope.getEvents();
            },
            function(err){
                console.error(err);
            });
        }
        // Gets events for artists starting at artist_iter_start and ending at artist_iter_end
        $scope.getEvents = function () {
            console.log("Updating events with artists from " + artist_iter_start + " to " + artist_iter_end);
            var numArtists = $scope.data.artists.length;
            var pages = numArtists / ARTIST_PAGING;
            var currPage = artist_iter_start / ARTIST_PAGING;

            if (currPage < pages) {
                var start = artist_iter_start;
                var end = artist_iter_end <= numArtists ? artist_iter_end : numArtists;
                var currArtists = [];

                for (var i = start; i < end; i++) {
                    currArtists.push($scope.data.artists[i]);
                }
                eventService.getEvents(currArtists).then(function (result) {
                    // If successful, increment page count
                    updateArtistPaging(end + 1, end + ARTIST_PAGING);
                    var retrievedEvents = result.data.events;
                    var tempEvents = $scope.data.events;
                    tempEvents = tempEvents.concat(retrievedEvents);
                    $scope.update({ "key": "events", "value": tempEvents });
                }, function (err) {
                    console.error(err);
                });
            }
        }

        $scope.nextEvent = function () {
            if ($scope.data.events.length > 0) {
                var tempCurr = $scope.data.events[0];
                var tempEvents = $scope.data.events;
                tempEvents.shift();

                $scope.update({ "key": "curr_event", "value": tempCurr });
                $scope.update({ "key": "events", "value": tempEvents });
            }
        }

        function init() {
            updateArtistPaging(0, ARTIST_PAGING)
            $scope.getTopArtists();
            $scope.loading = false;
        }

        function updateArtistPaging(start, end) {
            artist_iter_start = start;
            artist_iter_end = end;
        }

        init();
    }
})();