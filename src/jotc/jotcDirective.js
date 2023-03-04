(function() {
    let User;
    /**
     */
    class Jotc {
        /**
         * @param {$rootScope} scope
         */
        constructor(scope) {
            this.scope = scope;
            this.output = '';
        }

        onSubmit() {
            console.log('submit');
        }
    }

    angular.module("JOTC").directive('jotc', [
        '$injector',
        function($injector) {
            User = $injector.get('User');
            return {
                restrict: 'E',
                template: '<div>' +
                    '  <div>Please enter the JOTC inputs.</div>' +

                    '  <div>N must be an integer equal or greater than 2 and lesser or equal than 100.</div>' +
                    '  <label><b>Number of clouds (N)</b></label>' +
                    '  <input class="jotc-input" type="number" ><br>' +

                    '  <div>The clouds must be N space-separated binary integers (0 or 1) where the first and last integers must be 0.' +
                    '  0 denotes a safe cloud and 1 denotes a cloud that must be avoided.</div>' +
                    '  <label><b>Clouds (N binary integers describing clouds)</b></label>' +
                    '  <input class="jotc-input" type="text" ><br>' +

                    '  <button class="fancy-button" ng-click="jotc.onSubmit()">Submit</button><br>' +

                    '<div class="jotc-output">' +
                    '  <label><b>Output:</b></label>' +
                    '  <div>{{jotc.output}}</div>' +
                    '  <div>' +
                    '</div>',
                scope: {
                    user: '=',
                    adminMode: '='
                },
                link: (scope) => {
                    scope.jotc = new Jotc(scope);
                }
            };
        }
    ]);
})();
