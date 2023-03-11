describe('Jotc directive', function() {
    beforeEach(angular.mock.module('JOTC'));
    let $rootScope;
    let jotcDirectiveElement;
    let jotcDirective;
    let $scope;
    let $compile;
    let JOTCStorage;
    let User;

    const directiveHtml = `<jotc user="user"></jotc>`;

    beforeEach(function() {
        angular.mock.inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            JOTCStorage = $injector.get('JOTCStorage');
            User = $injector.get('User');
        });
    });

    beforeEach(function() {
        $scope = $rootScope.$new();
        $scope.user = new User('testFirstName', 'testLastName', 'test@email.com', new Date('1994-01-01'));
        jotcDirectiveElement = $compile(directiveHtml)($scope);
        jotcDirective = jotcDirectiveElement.isolateScope().jotc;
        jotcDirectiveElement = jotcDirectiveElement[0].firstElementChild;
        $scope.$digest();
    });

    afterEach(function () {
        jasmine.clock().uninstall();
    });

    it('contains the expected elements', function() {
        expect(jotcDirectiveElement.getElementsByTagName('input').length).toBe(2);
        expect(jotcDirectiveElement.getElementsByTagName('button').length).toBe(1);
    });

    it('show user feedback when the inputs are invalid', function() {
        const invalidFeedbackElem = jotcDirectiveElement.getElementsByClassName('invalid')[0];
        expect(invalidFeedbackElem.classList).toContain('ng-hide');

        jotcDirective.onSolve();
        $scope.$digest();

        expect(invalidFeedbackElem.classList).not.toContain('ng-hide');
        expect(jotcDirective.valid).toBeFalse();
    });

    it('presents the solution when clicking the solve button', function() {
        expect(jotcDirective.solution).toBe('');

        jotcDirective.numberOfCloudsInput = 4;
        jotcDirective.cloudValueInput = '0 1 0 0';
        $scope.$digest();
        jotcDirective.onSolve();
        $scope.$digest();

        expect(jotcDirective.solution).toBe(2);
        const invalidFeedbackElem = jotcDirectiveElement.getElementsByClassName('invalid')[0];
        expect(invalidFeedbackElem.classList).toContain('ng-hide');
        expect(jotcDirective.valid).toBeTrue();
    });

    it('stores jotc valid requests', function() {
        spyOn(JOTCStorage, 'store').and.callFake(angular.noop);
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date('2023-01-02'));

        jotcDirective.numberOfCloudsInput = 4;
        jotcDirective.cloudValueInput = '0 1 0 0';
        $scope.$digest();
        jotcDirective.onSolve();
        $scope.$digest();

        const expectedRequestOutput = {
            userName: 'testFirstName testLastName',
            email: 'test@email.com',
            date: '2023-01-02',
            numberOfClouds: 4,
            cloudValues: '0 1 0 0',
            output: 2
        };

        expect(JOTCStorage.store).toHaveBeenCalledTimes(1);
        expect(JOTCStorage.store).toHaveBeenCalledWith(expectedRequestOutput);
    });

    it('stores jotc invalid requests', function() {
        spyOn(JOTCStorage, 'store').and.callFake(angular.noop);
        jasmine.clock().install();
        jasmine.clock().mockDate(new Date('2023-01-02'));

        jotcDirective.numberOfCloudsInput = 4;
        jotcDirective.cloudValueInput = '0';
        $scope.$digest();
        jotcDirective.onSolve();
        $scope.$digest();

        const expectedRequestOutput = {
            userName: 'testFirstName testLastName',
            email: 'test@email.com',
            date: '2023-01-02',
            numberOfClouds: 4,
            cloudValues: '0',
            output: jasmine.any(String) // simply validate that the output is a string message.
            // Specific message assertions are not this test's responsibility.
        };

        expect(JOTCStorage.store).toHaveBeenCalledTimes(1);
        expect(JOTCStorage.store).toHaveBeenCalledWith(expectedRequestOutput);
    });
});
