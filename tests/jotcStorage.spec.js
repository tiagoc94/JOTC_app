describe('JOTC Storage', function() {
    beforeEach(angular.mock.module('JOTC'));
    let JOTCStorage;
    let $window;

    const mockData1 = {
        userName: 'Joe Bob'
    };
    const mockData2 = {
        userName: 'Boberton Johnsworth'
    };

    beforeEach(function() {
        angular.mock.inject(function($injector) {
            JOTCStorage = $injector.get('JOTCStorage');
            $window = $injector.get('$window');
        });
    });

    it('stores data in localstorage correctly', function() {
        spyOn($window.localStorage, 'getItem').and.callFake(() => JSON.stringify([mockData1]));
        spyOn($window.localStorage, 'setItem').and.callFake(() => angular.noop);

        JOTCStorage.store(mockData2);

        expect($window.localStorage.getItem).toHaveBeenCalledTimes(1);
        expect($window.localStorage.setItem).toHaveBeenCalledWith(
            'jotcStorage',
            JSON.stringify([mockData1, mockData2])
        );
    });

    it('accesses the storage correctly', function() {
        spyOn($window.localStorage, 'getItem').and.callFake(() => JSON.stringify([mockData1]));
        expect(JOTCStorage.getAll()).toEqual([mockData1]);
    });
});
