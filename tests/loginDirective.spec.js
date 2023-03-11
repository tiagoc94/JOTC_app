describe('Login directive', function() {
    beforeEach(angular.mock.module('JOTC'));
    let $rootScope;
    let $httpBackend;
    let loginDirectiveElement;
    let loginDirective;
    let $scope;
    let $compile;
    let EmailVerifier;
    let $q;
    let User;

    const directiveHtml = `<login user="user"
                                  admin-mode="adminMode"
                                  logged-in="loggedIn">
                            </login>`;


    beforeEach(function() {
        angular.mock.inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            $compile = $injector.get('$compile');
            EmailVerifier = $injector.get('EmailVerifier');
            $q = $injector.get('$q');
            User = $injector.get('User');
        });
    });

    beforeEach(function() {
        $httpBackend.whenGET(/^.+/).respond({});
        $scope = $rootScope.$new();
        $scope.user = null;
        $scope.adminMode = false;
        $scope.loggedIn = false;
        loginDirectiveElement = $compile(directiveHtml)($scope);
        loginDirective = loginDirectiveElement.isolateScope().login;
        loginDirectiveElement = loginDirectiveElement[0].firstElementChild;
        $scope.$digest();
    });

    function populateFieldsWithTestData() {
        loginDirective.email = 'testEmail';
        loginDirective.firstName = 'testFirstName';
        loginDirective.lastName = 'testLastName';
        loginDirective.dateOfBirth = new Date('1994-01-01');
    }

    it('contains the expected elements', function() {
        expect(loginDirectiveElement.getElementsByTagName('input').length).toBe(4);
        expect(loginDirectiveElement.getElementsByClassName('invalid-login').length).toBe(0);
        expect(loginDirectiveElement.getElementsByTagName('button').length).toBe(1);
    });

    it('validates empty fields', function() {
        loginDirective.onLoginClick();
        $scope.$digest();

        expect(loginDirectiveElement.getElementsByClassName('invalid-login').length).toBe(3);
        expect($scope.loggedIn).toBeFalse();
    });

    it('validates birth date', function() {
        loginDirective.email = 'testEmail';
        loginDirective.firstName = 'testFirstName';
        loginDirective.lastName = 'testLastName';
        loginDirective.dateOfBirth = new Date('2020-01-01')
        $scope.$digest();
        loginDirective.onLoginClick();
        $scope.$digest();

        const invalidElements = loginDirectiveElement.getElementsByClassName('invalid-login');
        expect(invalidElements.length).toBe(1);
        expect(invalidElements[0].type).toBe('date');

        const invalidBirthDateFeedbackElem = loginDirectiveElement.getElementsByClassName('feedback-invalid')[1];
        expect(invalidBirthDateFeedbackElem.classList).not.toContain('ng-hide');

        expect($scope.loggedIn).toBeFalse();
    });

    it('shows user feedback when the email is invalid', function() {
        spyOn(EmailVerifier, 'isEmailValid').and.callFake(function() {
            const defer = $q.defer();
            defer.reject();
            return defer.promise;
        });

        populateFieldsWithTestData();
        $scope.$digest();
        loginDirective.onLoginClick();
        $scope.$digest();

        const invalidElements = loginDirectiveElement.getElementsByClassName('invalid-login');
        expect(invalidElements.length).toBe(1);

        const invalidEmailFeedbackElem = loginDirectiveElement.getElementsByClassName('feedback-invalid')[0];
        expect(invalidEmailFeedbackElem.classList).not.toContain('ng-hide');

        expect($scope.loggedIn).toBeFalse();
    });

    it('logs in successfully as non authenticated user', function() {
        spyOn(EmailVerifier, 'isEmailValid').and.callFake(function() {
            const defer = $q.defer();
            defer.resolve();
            return defer.promise;
        });
        spyOn(EmailVerifier, 'isUserAdmin').and.callFake(function() {
            const defer = $q.defer();
            defer.reject();
            return defer.promise;
        });

        populateFieldsWithTestData();
        $scope.$digest();
        loginDirective.onLoginClick();
        $scope.$digest();

        expect($scope.user).toBeDefined();
        expect($scope.user).toBeInstanceOf(User);
        expect($scope.adminMode).toBeFalse();
        expect($scope.loggedIn).toBeTrue();
    });

    it('logs in successfully as authenticated user', function() {
        spyOn(EmailVerifier, 'isEmailValid').and.callFake(function() {
            const defer = $q.defer();
            defer.resolve();
            return defer.promise;
        });
        spyOn(EmailVerifier, 'isUserAdmin').and.callFake(function() {
            const defer = $q.defer();
            defer.resolve();
            return defer.promise;
        });

        populateFieldsWithTestData();
        $scope.$digest();
        loginDirective.onLoginClick();
        $scope.$digest();

        expect($scope.user).toBeDefined();
        expect($scope.user).toBeInstanceOf(User);
        expect($scope.adminMode).toBeTrue();
        expect($scope.loggedIn).toBeTrue();
    });
});
