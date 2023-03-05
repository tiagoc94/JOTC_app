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
                    this._getCachedValue(email) ? resolve() : reject();
                } else {
                    EmailableClient.verify(email)
                        .then((response) => {
                            const value = response.data.state === 'deliverable';
                            this._cacheResponse(email, value);
                            value ? resolve() : reject();
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
         * @param {string} email
         * @return {boolean}
         * @private
         */
        _getCachedValue(email) {
            const cache = this._getCacheState();
            return cache[email];
        }

        /**
         * @param {string} email
         * @param {boolean} value
         * @private
         */
        _cacheResponse(email, value) {
            const cache = this._getCacheState();
            cache[email] = value;
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
