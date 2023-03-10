(function() {
    let JOTCEngine;
    /**
     */
    class Jotc {
        /**
         * @param {$rootScope} scope
         */
        constructor(scope) {
            this.scope = scope;
            this.solution = '';
            this.numberOfCloudsInput = 0;
            this.cloudValueInput = '';
            this.valid = true;
        }

        onSolve() {
            const jotcEngine = new JOTCEngine(this.numberOfCloudsInput, this.cloudValueInput);

            const inputValidation = jotcEngine.validateInputs();
            if (inputValidation !== true) {
                this.valid = false;
                this.invalidFeedback = inputValidation;
                this.solution = '';
                return;
            }

            this.valid = true;
            this.solution = jotcEngine.solve();
        }
    }

    angular.module("JOTC").directive('jotc', [
        '$injector',
        function($injector) {
            JOTCEngine = $injector.get('JOTCEngine');
            return {
                restrict: 'E',
                template: '<div>' +
                    '  <div><b>Please enter the JOTC inputs.</b></div><br>' +

                    '  <div>N must be an integer equal or greater than 2 and lesser or equal than 100.</div>' +
                    '  <label><b>Number of clouds (N)</b></label>' +
                    '  <input class="jotc-input" type="number" ng-model="jotc.numberOfCloudsInput"><br>' +

                    '  <div>The clouds must be N space-separated binary integers (0 or 1) where the first and last integers must be 0.' +
                    '  0 denotes a safe cloud and 1 denotes a cloud that must be avoided.</div>' +
                    '  <label><b>Clouds (N binary integers describing clouds)</b></label>' +
                    '  <input class="jotc-input" type="text" ng-model="jotc.cloudValueInput"><br>' +

                    ' <div class="invalid" ng-show="!jotc.valid">{{jotc.invalidFeedback}}</div>' +

                    '  <button class="fancy-button" ng-click="jotc.onSolve()">Solve</button><br>' +

                    '<div class="jotc-output">' +
                    '  <label><b>Solution:</b></label>' +
                    '  <div>{{jotc.solution}}</div>' +
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
