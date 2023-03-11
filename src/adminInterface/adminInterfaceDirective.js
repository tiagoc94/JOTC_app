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

            this.jotcRequests = [
                {
                    name: 'userName',
                    email: 'email@test',
                    date: '2022-11-11',
                    numberOfClouds: '4',
                    cloudValues: '0 0 1 0',
                    solution: '2'
                },
                {
                    name: 'userName',
                    email: 'email@test',
                    date: '2022-11-14',
                    numberOfClouds: '2',
                    cloudValues: '0 0 1 0 0 0 0 0 0 0 0',
                    solution: 'invalid message test'
                },
            ];

            let i = 0;
            while (i < 100) {
                this.jotcRequests.push({
                    name: 'userName',
                    email: 'email@test',
                    date: '2022-11-14',
                    numberOfClouds: '2',
                    cloudValues: '0 0 1 0 0 0 0 0 0 0 0',
                    solution: 'invalid message test'
                });

                i++;
            }

        }

        onResetFilters() {
            this.emailQuery = '';
            this.dateFilterStart = null;
            this.dateFilterEnd = null;
        }

        onSearch() {

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
                    '      <th class="table-cell">Solution</th>' +
                    '      <tr ng-repeat="requestData in adminInterface.jotcRequests">' +
                    '        <td class="table-cell">{{ requestData.name }}</td>' +
                    '        <td class="table-cell">{{ requestData.email }}</td>' +
                    '        <td class="table-cell">{{ requestData.date }}</td>' +
                    '        <td class="table-cell">{{ requestData.numberOfClouds }}</td>' +
                    '        <td class="table-cell">{{ requestData.cloudValues }}</td>' +
                    '        <td class="table-cell">{{ requestData.solution }}</td>' +
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
