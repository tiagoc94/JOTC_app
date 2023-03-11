(function() {
    let JOTCStorage;
    /**
     */
    class AdminInterface {
        /**
         * @param {$rootScope} scope
         */
        constructor(scope) {
            this.scope = scope;
            this.onResetFilters();
            this.jotcRequests = [];
        }

        /**
         */
        onResetFilters() {
            this.emailQuery = '';
            this.dateFilterStart = null;
            this.dateFilterEnd = null;
        }

        /**
         */
        onSearch() {
            let storedRequests = JOTCStorage.getAll();
            storedRequests = this._filterEmail(storedRequests);
            storedRequests = this._filterDateStart(storedRequests);
            this.jotcRequests = this._filterDateEnd(storedRequests);
        }

        /**
         * @param {Object[]} jotcRequests
         * @return {Object[]}
         * @private
         */
        _filterEmail(jotcRequests) {
            if (this.emailQuery === '') {
                return jotcRequests;
            }

            return jotcRequests.filter((data) => data.email.includes(this.emailQuery));
        }

        /**
         * @param {Object[]} jotcRequests
         * @return {Object[]}
         * @private
         */
        _filterDateStart(jotcRequests) {
            if (this.dateFilterStart == null) {
                return jotcRequests;
            }

            return jotcRequests.filter((data) => {
                const requestDate = new Date(data.date);
                return requestDate >= this.dateFilterStart;
            });
        }

        /**
         * @param {Object[]} jotcRequests
         * @return {Object[]}
         * @private
         */
        _filterDateEnd(jotcRequests) {
            if (this.dateFilterEnd == null) {
                return jotcRequests;
            }

            return jotcRequests.filter((data) => {
                const requestDate = new Date(data.date);
                return requestDate <= this.dateFilterEnd;
            });
        }
    }

    angular.module("JOTC").directive('adminInterface', [
        '$injector',
        function($injector) {
            JOTCStorage = $injector.get('JOTCStorage');
            return {
                restrict: 'E',
                templateUrl: '/src/adminInterface/adminInterface.tpl.html',
                scope: {
                },
                link: (scope) => {
                    scope.adminInterface = new AdminInterface(scope);
                }
            };
        }
    ]);
})();
