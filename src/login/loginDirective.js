(function() {
    let User;
    /**
     */
    class Login {
        /**
         * @param {$rootScope} scope
         */
        constructor(scope) {
            this.scope = scope;
        }

        onLoginClick() {
            this.scope.use = new User('tiago', 'conc', 'testEmail', '23/01/1994');
            this.scope.adminMode = true;
            this.scope.loggedIn = true;
        }
    }

    angular.module("JOTC").directive('login', [
        '$injector',
        function($injector) {
            User = $injector.get('User');
            return {
                restrict: 'E',
                template: '<div>' +
                            '<input class="login-input" type="text" placeholder="Email Adress"><br>' +
                            '<input class="login-input" type="text" placeholder="First Name"><br>' +
                            '<input class="login-input" type="text" placeholder="Last Name"><br>' +
                            '<label><b>When were you born?</b></label><br>' +
                            '<input class="login-input" type="date" ><br>' +
                            '<button class="fancy-button" ng-click="login.onLoginClick()">Login</button>' +
                        '</div>',
                scope: {
                    user: '=',
                    adminMode: '=',
                    loggedIn: '='
                },
                link: (scope) => {
                    scope.login = new Login(scope);
                }
            };
        }
    ]);
})();
