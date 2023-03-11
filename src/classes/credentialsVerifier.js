(function() {
    const LOCAL_STORAGE_KEY = 'emailCache';
    const ADMIN_NAMES = ['admin1', 'admin2'];
    let EmailableClient;
    let $window;
    let $q;
    /**
     */
    class CredentialsVerifier {

        /**
         */
        constructor() {
            const cache = $window.localStorage.getItem(LOCAL_STORAGE_KEY);
            if (cache == null) {
                $window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({}));
            }
        }

        /**
         * @param {string} email
         * @return {Promise}
         */
        isEmailValid(email) {
            return $q((resolve, reject) => {
                if (this._isCached(email)) {
                    this._checkResponse(email) ? resolve() : reject();
                } else {
                    EmailableClient.verify(email)
                        .then((response) => {
                            this._cacheResponse(email, response.data);
                            this._checkResponse(email) ? resolve() : reject();
                        });
                }
            });
        }

        /**
         * @param {string} email
         * @return {boolean}
         * @private
         */
        _isCached(email) {
            const cache = this._getCacheState();
            return cache[email] != null;
        }

        /**
         * The email is considered valid if the state response property is 'deliverable'
         * @param {string} email
         * @return {boolean}
         * @private
         */
        _checkResponse(email) {
            const cache = this._getCacheState();
            return cache[email].state === 'deliverable';
        }

        /**
         * @param {string} email
         * @param {boolean} responseData
         * @private
         */
        _cacheResponse(email, responseData) {
            const cache = this._getCacheState();
            cache[email] = responseData;
            $window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cache));
        }

        /**
         * @return {Object}
         * @private
         */
        _getCacheState() {
            const cache = $window.localStorage.getItem(LOCAL_STORAGE_KEY);
            return JSON.parse(cache);
        }

        /**
         * Simulate a request to a backend that takes 0.5 seconds
         * @param {string} name
         * @return {Promise}
         */
        isUserAdmin(name) {
            return $q((resolve, reject) => {
                setTimeout(() => {
                    ADMIN_NAMES.includes(name) ? resolve() : reject();
                }, 500);
            });
        }
    }

    angular.module('JOTC').service('CredentialsVerifier', [
        '$injector',
        function($injector) {
            EmailableClient = $injector.get('EmailableClient');
            $window = $injector.get('$window');
            $q = $injector.get('$q');
            return new CredentialsVerifier();
        }
    ]);
})();
