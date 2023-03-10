const JOTC = angular.module("JOTC", []);
JOTC.controller("appCtrl", function($scope) {

    $scope.resetApp = () => {
        $scope.user = null;
        $scope.adminMode = false;
        $scope.loggedIn = false;
    }

    $scope.logOut = () => {
        $scope.resetApp();
        $scope.$broadcast('loggedOut');
    }

    $scope.resetApp();
});

