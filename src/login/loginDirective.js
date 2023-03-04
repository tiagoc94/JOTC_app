(function() {
    /**
     */
    class Login {
        /**
         * @param {$rootScope} scope
         */
        constructor(scope) {
            this.scope = scope;
        }

    }

    JOTC.directive('login', [
        function() {
            return {
                restrict: 'E',
                template: '<div>' +
                            '<input class="login-input" type="text" placeholder="Email Adress"><br>' +
                            '<input class="login-input" type="text" placeholder="First Name"><br>' +
                            '<input class="login-input" type="text" placeholder="Last Name"><br>' +
                            '<label><b>When were you born?</b></label><br>' +
                            '<input class="login-input" type="date" ><br>' +
                            '<button class="fancy-button">Login</button>' +
                        '</div>',
                scope: {
                    user: '='
                },
                link: (scope) => {
                    scope.login = new Login(scope);
                }
            };
        }
    ]);
})();
