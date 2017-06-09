(function(){
    var app = angular.module("finderApp");
    app.directive("loginComp", loginComp).controller("loginCtrl", loginCtrl);
    loginCtrl.$inject = ["$scope", "$window", "$location", "spotifyLoginService"];

    function loginComp(){
        return {
            restrict: 'E',
            scope: {
                data: '=',
                update: '&'
            },
            templateUrl: 'scripts/login_component/login.view.html'
        };
    }

    function loginCtrl($scope, $window, $location, spotifyLoginService){
        
        $scope.initLogin = function() {
            spotifyLoginService.login().then(function(result){
                var url = result.data.auth_url;
                $window.location.href = url;
            }, function(error){
                // Do something about the error
                console.log(error);
            });
        }

        function init() {
            var params = $location.hash();
            if(params) {
                var access_token = params.match(/access_token=([^&]*)/);
                var refresh_token = params.match(/refresh_token=([^&]*)/);
                if(access_token && refresh_token){
                    $scope.update({key: "spotify_access_token", value: access_token[1]});
                    $scope.update({key: "spotify_refresh_token", value: refresh_token[1]});
                }
                $location.hash("");
            }
            
            console.log(params);
    
        }

        function getHashParams() {
            var hashParams = {};
            var e, r = /([^&;=]+)=?([^&;]*)/g;
            var q = window.location.hash.substring(1);
            while ( e = r.exec(q)) {
                hashParams[e[1]] = decodeURIComponent(e[2]);
            }
            return hashParams;
        }

        init();
    }

})();