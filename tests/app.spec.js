describe('App controller', function() {
    beforeEach(angular.mock.module('JOTC'));
    let $rootScope;
    let $scope;
    let $controller;
    let appController;

    beforeEach(function() {
        angular.mock.inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
        });
    });

    beforeEach(function() {
        $scope = $rootScope.$new();
        $scope.user = null;
        $scope.adminMode = false;
        $scope.loggedIn = false;
        appController = $controller('appCtrl', {
            $scope: $scope
        });
    });

    it('log out action resets variables and broadcasts event', function() {
        $scope.user = 'testValue';
        $scope.adminMode = true;
        $scope.loggedIn = true;
        spyOn($scope, '$broadcast').and.callFake(angular.noop);

        $scope.logOut();
        $scope.$digest();

        expect($scope.user).toBeNull();
        expect($scope.adminMode).toBeFalse();
        expect($scope.loggedIn).toBeFalse();
        expect($scope.$broadcast).toHaveBeenCalledWith('loggedOut');
    });
});
