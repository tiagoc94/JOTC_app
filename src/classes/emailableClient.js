(function() {
    const TEST_API_KEY = 'test_5863f00a3be53a5dc89b';
    const LIVE_API_KEY = 'live_741f9db19cefabcbc60a';
    let $http;
    /**
     */
    class EmailableClient {

        verify(email) {
            const params = {
                email: email,
                api_key: TEST_API_KEY
            }

            const requestOptions = {
                method: 'GET',
                url: 'https://api.emailable.com/v1/verify',
                params: params
            }

            return $http(requestOptions);
        }
    }

    angular.module('JOTC').service('EmailableClient', [
        '$injector',
        function($injector) {
            $http = $injector.get('$http');
            return new EmailableClient();
        }
    ]);
})();
