describe('CredentialsVerifier', function() {
    beforeEach(angular.mock.module('JOTC'));
    let CredentialsVerifier;
    let $window;
    let EmailableClient;
    let $q;
    let $rootScope;

    const mockValidEmailResponse = {
        data: {state: 'deliverable'}
    };

    beforeEach(function() {
        angular.mock.inject(function($injector) {
            CredentialsVerifier = $injector.get('CredentialsVerifier');
            $window = $injector.get('$window');
            EmailableClient = $injector.get('EmailableClient');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });
    });

    it('verifies emails remotely and caches the response', function() {
        let mockStorage = {};
        spyOn($window.localStorage, 'getItem').and.callFake(() => JSON.stringify(mockStorage));
        spyOn($window.localStorage, 'setItem').and.callFake((key, toStore) => mockStorage = JSON.parse(toStore));
        spyOn(EmailableClient, 'verify').and.callFake(() => {
            const defer = $q.defer();
            defer.resolve(mockValidEmailResponse);
            return defer.promise;
        });

        CredentialsVerifier.isEmailValid('test@email')
            .then(angular.noop, () => fail('email was considered invalid'));

        $rootScope.$apply();

        expect($window.localStorage.setItem).toHaveBeenCalledTimes(1);

        CredentialsVerifier.isEmailValid('test@email')
            .then(angular.noop, () => fail('email was considered invalid'));

        $rootScope.$apply();

        expect(EmailableClient.verify).toHaveBeenCalledTimes(1);
    });

    it('verifies emails locally', function() {
        const storedResponse = {'test@email': mockValidEmailResponse};
        spyOn($window.localStorage, 'getItem').and.callFake(() => JSON.stringify(storedResponse));
        spyOn($window.localStorage, 'setItem').and.callFake(angular.noop);
        spyOn(EmailableClient, 'verify').and.callFake(angular.noop);

        CredentialsVerifier.isEmailValid('test@email').then(function(result) {
            expect(result).toBeTrue();
        });
        expect(EmailableClient.verify).toHaveBeenCalledTimes(0);
    });
});
