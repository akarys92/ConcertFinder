(function(){
   'use strict';
   var app = angular.module("finderApp");
   app.controller("dataCtrl", dataCtrl);

   dataCtrl.$inject = ["$scope"];

   function dataCtrl($scope){
       $scope.state = {
           "spotify_access_token": "",
           "spotify_refresh_token": "",
           "artists": [],
           "events": [],
           "curr_event": {}
       };
    
       $scope.updateState = function(key, value){
           var temp = Object.assign({}, $scope.state);
           temp[key] = value;
           $scope.state = Object.assign({}, temp);
       }
   } 
})();