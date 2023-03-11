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
                template: '<div>' +

                    '  <div><b>You are logged in as admin.</b></div><br>' +

                    '  <div>Search JOTC requests console:</div><br>' +

                    '  <div class="filters-container">' +
                        '<div class="filter-fields">' +
                            '<input class="filter-input" type="text" placeholder="Email search" ng-model="adminInterface.emailQuery"><br>' +
                            '<label>Start date:</label><br>' +
                            '<input class="filter-input" type="date" ng-model="adminInterface.dateFilterStart"><br>' +
                            '<label>End date:</label><br>' +
                            '<input class="filter-input" type="date" ng-model="adminInterface.dateFilterEnd"><br>' +
                        '</div>' +

                        '<div class="filter-buttons">' +
                            '<button class="admin-interface-button" ng-click="adminInterface.onResetFilters()">Reset Filters</button>' +
                            '<button class="admin-interface-button" ng-click="adminInterface.onSearch()">Search</button>' +
                        '</div>' +
                    '</div>' +

                    '<table class="requests-table">' +
                    '      <th class="table-cell">Name</th>' +
                    '      <th class="table-cell">Email</th>' +
                    '      <th class="table-cell">Date</th>' +
                    '      <th class="table-cell">Number of clouds (N)</th>' +
                    '      <th class="table-cell">Clouds</th>' +
                    '      <th class="table-cell">Output</th>' +
                    '      <tr ng-repeat="requestData in adminInterface.jotcRequests">' +
                    '        <td class="table-cell">{{ requestData.userName }}</td>' +
                    '        <td class="table-cell">{{ requestData.email }}</td>' +
                    '        <td class="table-cell">{{ requestData.date }}</td>' +
                    '        <td class="table-cell">{{ requestData.numberOfClouds }}</td>' +
                    '        <td class="table-cell">{{ requestData.cloudValues }}</td>' +
                    '        <td class="table-cell">{{ requestData.output }}</td>' +
                    '      </tr>' +
                    '    </table>' +

                    '</div>',
                scope: {
                },
                link: (scope) => {
                    scope.adminInterface = new AdminInterface(scope);
                }
            };
        }
    ]);
})();
