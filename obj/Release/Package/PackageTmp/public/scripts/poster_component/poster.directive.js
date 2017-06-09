(function () {
    var app = angular.module("finderApp");
    app.directive("posterComp", posterComp).controller("posterCtrl", posterCtrl);
    posterCtrl.$inject = ["$scope"];

    function posterComp() {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                currEvent: '=',
                getNext: '&',
                update: '&'
            },
            templateUrl: 'scripts/poster_component/poster.view.html'
        };
    }

    function posterCtrl($scope) {
        console.log($scope.currEvent);
        $scope.nextWrapper = function () {
            $scope.getNext()();
        }
    }

})();