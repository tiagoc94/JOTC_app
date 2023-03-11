describe('Admin interface directive', function() {
    beforeEach(angular.mock.module('JOTC'));
    let $rootScope;
    let adminInterfaceDirectiveElement;
    let adminInterfaceDirective;
    let $scope;
    let $compile;
    let JOTCStorage;

    const directiveHtml = `<admin-interface></admin-interface>`;

    const mockResult1 = {
        "userName": "Joe Bob",
        "email": "joe@email",
        "date": "2023-03-10",
        "numberOfClouds": 4,
        "cloudValues": "0 9 0",
        "output": "The cloud values must be space-separated integers with values 1 or 0."
    };
    const mockResult2 = {
        "userName": "Boberton Johnsworth",
        "email": "bobert@email",
        "date": "2023-03-09",
        "numberOfClouds": 0,
        "cloudValues": "",
        "output": "The number of clouds must be an integer between 2 and 100."
    };
    const mockResult3 = {
        "userName": "Boberton Johnsworth",
        "email": "bobert@email",
        "date": "2023-03-08",
        "numberOfClouds": 0,
        "cloudValues": "",
        "output": "The number of clouds must be an integer between 2 and 100."
    };
    const mockStorage = [
        mockResult1,
        mockResult2,
        mockResult3
    ];

    beforeEach(function() {
        angular.mock.inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            JOTCStorage = $injector.get('JOTCStorage');
        });
    });

    beforeEach(function() {
        $scope = $rootScope.$new();
        adminInterfaceDirectiveElement = $compile(directiveHtml)($scope);
        adminInterfaceDirective = adminInterfaceDirectiveElement.isolateScope().adminInterface;
        adminInterfaceDirectiveElement = adminInterfaceDirectiveElement[0].firstElementChild;
        $scope.$digest();

        spyOn(JOTCStorage, 'getAll').and.callFake(() => mockStorage);
    });

    it('contains the expected elements', function() {
        expect(adminInterfaceDirectiveElement.getElementsByTagName('input').length).toBe(3);
        expect(adminInterfaceDirectiveElement.getElementsByTagName('button').length).toBe(2);
        expect(adminInterfaceDirectiveElement.getElementsByTagName('table').length).toBe(1);
        expect(adminInterfaceDirectiveElement.getElementsByTagName('tr').length).toBe(1);
    });

    it('search with no filters shows all requests', function() {
        adminInterfaceDirective.onSearch();
        $scope.$digest();

        expect(adminInterfaceDirective.jotcRequests).toEqual(mockStorage);
        expect(adminInterfaceDirectiveElement.getElementsByTagName('tr').length).toBe(4);
    });

    it('filters by email correctly', function() {
        adminInterfaceDirective.emailQuery = 'jo';
        $scope.$digest();
        adminInterfaceDirective.onSearch();
        $scope.$digest();

        expect(adminInterfaceDirective.jotcRequests).toEqual([mockResult1]);
        expect(adminInterfaceDirectiveElement.getElementsByTagName('tr').length).toBe(2);


        adminInterfaceDirective.emailQuery = 'no match';
        $scope.$digest();
        adminInterfaceDirective.onSearch();
        $scope.$digest();

        expect(adminInterfaceDirective.jotcRequests).toEqual([]);
        expect(adminInterfaceDirectiveElement.getElementsByTagName('tr').length).toBe(1);
    });

    it('filters by date correctly', function() {
        adminInterfaceDirective.dateFilterStart = new Date('2023-03-08');
        adminInterfaceDirective.dateFilterEnd = new Date('2023-03-09');
        $scope.$digest();
        adminInterfaceDirective.onSearch();
        $scope.$digest();

        expect(adminInterfaceDirective.jotcRequests).toEqual([mockResult2, mockResult3]);
        expect(adminInterfaceDirectiveElement.getElementsByTagName('tr').length).toBe(3);


        adminInterfaceDirective.dateFilterStart = new Date('2023-03-09');
        adminInterfaceDirective.dateFilterEnd = null;
        $scope.$digest();
        adminInterfaceDirective.onSearch();
        $scope.$digest();

        expect(adminInterfaceDirective.jotcRequests).toEqual([mockResult1, mockResult2]);
        expect(adminInterfaceDirectiveElement.getElementsByTagName('tr').length).toBe(3);


        adminInterfaceDirective.dateFilterStart = null
        adminInterfaceDirective.dateFilterEnd = new Date('2023-03-08');;
        $scope.$digest();
        adminInterfaceDirective.onSearch();
        $scope.$digest();

        expect(adminInterfaceDirective.jotcRequests).toEqual([mockResult3]);
        expect(adminInterfaceDirectiveElement.getElementsByTagName('tr').length).toBe(2);
    });

    it('pressing the reset button resets the filters', function() {
        adminInterfaceDirective.emailQuery = 'jo';
        adminInterfaceDirective.dateFilterStart = new Date('2023-03-08');
        adminInterfaceDirective.dateFilterEnd = new Date('2023-03-09');
        $scope.$digest();

        expect(adminInterfaceDirective.emailQuery).toBe('jo');
        expect(adminInterfaceDirective.dateFilterStart).toEqual(new Date('2023-03-08'));
        expect(adminInterfaceDirective.dateFilterEnd).toEqual(new Date('2023-03-09'));

        adminInterfaceDirective.onResetFilters();
        $scope.$digest();

        expect(adminInterfaceDirective.emailQuery).toBe('');
        expect(adminInterfaceDirective.dateFilterStart).toBeNull();
        expect(adminInterfaceDirective.dateFilterEnd).toBeNull();
    });
});
