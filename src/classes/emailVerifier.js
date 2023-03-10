(function() {
    const LOCAL_STORAGE_KEY = 'emailCache';
    let EmailableClient;
    let $window;
    let $q;
    /**
     */
    class EmailVerifier {

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
         * The email is considered valid f the state response property is 'deliverable'
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
    }

    angular.module('JOTC').service('EmailVerifier', [
        '$injector',
        function($injector) {
            EmailableClient = $injector.get('EmailableClient');
            $window = $injector.get('$window');
            $q = $injector.get('$q');
            return new EmailVerifier();
        }
    ]);
})();
