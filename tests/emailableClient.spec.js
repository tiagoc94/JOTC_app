describe('EmailableClient', function() {
    beforeEach(angular.mock.module('JOTC'));
    let EmailableClient;
    let $httpBackend;

    beforeEach(function() {
        angular.mock.inject(function($injector) {
            EmailableClient = $injector.get('EmailableClient');
            $httpBackend = $injector.get('$httpBackend');
        });
    });

    it('sends a GET request to the emailable API', function() {
        EmailableClient.verify('test@email');

        const expectedRequest = /https:\/\/api\.emailable\.com\/v1\/verify\?api_key=\w+&email=test@email/;
        $httpBackend.expectGET(expectedRequest).respond({});
        $httpBackend.flush();
    });
});
