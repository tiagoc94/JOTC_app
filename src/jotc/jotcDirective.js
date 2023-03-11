(function() {
    let JOTCEngine;
    let JOTCStorage;
    /**
     */
    class Jotc {
        /**
         * @param {$rootScope} scope
         */
        constructor(scope) {
            this.scope = scope;
            this._init();
            this._setupListeners();
        }

        /**
         * @private
         */
        _init() {
            this.solution = '';
            this.numberOfCloudsInput = 0;
            this.cloudValueInput = '';
            this.valid = true;
            this.invalidFeedback = '';
        }

        /**
         * @private
         */
        _setupListeners() {
            this.scope.$on('loggedOut', () => {
                this._init();
            });
        }

        /**
         */
        onSolve() {
            const jotcEngine = new JOTCEngine(this.numberOfCloudsInput, this.cloudValueInput);

            const inputValidation = jotcEngine.validateInputs();
            if (inputValidation !== true) {
                this.valid = false;
                this.invalidFeedback = inputValidation;
                this.solution = '';

                this._storeRequest(this.invalidFeedback);
                return;
            }

            this.valid = true;
            this.solution = jotcEngine.solve();

            this._storeRequest(this.solution);
        }

        /**
         * @param {string} requestOutput
         * @private
         */
        _storeRequest(requestOutput) {
            const jotcData = {
                userName: this.scope.user.getFullName(),
                email: this.scope.user.email,
                date: new Date().toISOString().split('T')[0],
                numberOfClouds: this.numberOfCloudsInput,
                cloudValues: this.cloudValueInput,
                output: requestOutput
            };

            JOTCStorage.store(jotcData);
        }
    }

    angular.module("JOTC").directive('jotc', [
        '$injector',
        function($injector) {
            JOTCEngine = $injector.get('JOTCEngine');
            JOTCStorage = $injector.get('JOTCStorage');
            return {
                restrict: 'E',
                templateUrl: '/src/jotc/jotc.tpl.html',
                scope: {
                    user: '='
                },
                link: (scope) => {
                    scope.jotc = new Jotc(scope);
                }
            };
        }
    ]);
})();
