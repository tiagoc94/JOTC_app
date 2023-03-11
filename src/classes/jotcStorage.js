(function() {
    const LOCAL_STORAGE_KEY = 'jotcStorage';
    let $window;
    /**
     */
    class JOTCStorage {

        /**
         */
        constructor() {
            const jotcStorage = $window.localStorage.getItem(LOCAL_STORAGE_KEY);
            if (jotcStorage == null) {
                $window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
            }
        }

        /**
         * @param {Object} jotcData
         */
        store(jotcData) {
            const jotcRequests = this.getAll();
            jotcRequests.push(jotcData);
            $window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jotcRequests));
        }

        /**
         * @return {Object[]}
         */
        getAll() {
            const jotcStorage = $window.localStorage.getItem(LOCAL_STORAGE_KEY);
            return JSON.parse(jotcStorage);
        }
    }

    angular.module('JOTC').service('JOTCStorage', [
        '$injector',
        function($injector) {
            $window = $injector.get('$window');
            return new JOTCStorage();
        }
    ]);
})();
