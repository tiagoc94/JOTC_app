describe('Login directive', function() {
    beforeEach(angular.mock.module('JOTC'));
    let $rootScope;
    let $httpBackend;
    let loginDirectiveElement;
    let $scope;
    let $compile;

    const directiveHtml = `<login user="user"
                                  admin-mode="adminMode"
                                  logged-in="loggedIn">
                            </login>`;


    beforeEach(function() {
        angular.mock.inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            $compile = $injector.get('$compile');
        });
    });

    beforeEach(function() {
        $httpBackend.whenGET(/^.+/).respond({});
        $scope = $rootScope.$new();
        $scope.user = null;
        $scope.adminMode = false;
        $scope.loggedIn = false;
        loginDirectiveElement = $compile(directiveHtml)($scope)[0].firstElementChild;
        // const loginDirective = loginDirectiveElement.isolateScope().login;
        $scope.$digest();
    });

    it('initializes contains the expected elements', function() {
        expect(loginDirectiveElement.getElementsByTagName('input').length).toBe(4);
        expect(loginDirectiveElement.getElementsByClassName('invalid-login').length).toBe(0);
        expect(loginDirectiveElement.getElementsByTagName('button').length).toBe(1);
    });

});
