(function() {
    let User;
    let EmailVerifier;
    /**
     */
    class Login {
        /**
         * @param {$rootScope} scope
         */
        constructor(scope) {
            this.scope = scope;
            this._init();

            this._setupWatchers();
            this._setupListeners();
        }

        /**
         * @private
         */
        _init() {
            this.email = '';
            this.firstName = '';
            this.lastName = '';
            this.dateOfBirth = null;

            this.pendingEmailCheck = false;
            this.pendingAdminCheck = false;

            this.validEmailField = true;
            this.validFirstNameField = true;
            this.validLastNameField = true;
            this.validDateOfBirthField = true;

            this.emailVerificationFail = false;
        }

        /**
         * @private
         */
        _setupWatchers() {
            this.scope.$watch('login.email', () => {
                this.emailVerificationFail = false;
                this.validEmailField = true;
            });

            this.scope.$watch('login.firstName', () => {
                this.validFirstNameField = true;
            });

            this.scope.$watch('login.lastName', () => {
                this.validLastNameField = true;
            });

            this.scope.$watch('login.dateOfBirth', () => {
                this.validDateOfBirthField = true;
            });
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
        onLoginClick() {
            if (this.pendingEmailCheck || this.pendingAdminCheck) {
                return;
            }

            this.emailVerificationFail = false;

            if (!this._validateFieldsNotEmpty()) {
                return;
            }

            if (!this._validateDateOfBirth()) {
                return;
            }

            this.pendingEmailCheck = true;
            EmailVerifier.isEmailValid(this.email)
                .then(() => {
                    this._loginSuccessfully();
                }, () => {
                    this.validEmailField = false;
                    this.emailVerificationFail = true;
                })
                .finally(() => this.pendingEmailCheck = false);
        }

        /**
         * @return {boolean}
         * @private
         */
        _validateFieldsNotEmpty() {
            this.validEmailField = this.email !== '';
            this.validFirstNameField = this.firstName !== '';
            this.validLastNameField = this.lastName !== '';

            return this.validEmailField && this.validFirstNameField && this.validLastNameField;
        }

        /**
         * @return {boolean}
         * @private
         */
        _validateDateOfBirth() {
            if (this.dateOfBirth == null) {
                this.validDateOfBirthField = false;
            } else {
                // taken from https://www.scriptol.com/javascript/dates-difference.php
                const age = Number((new Date().getTime() - this.dateOfBirth.getTime()) / 31536000000).toFixed(0);
                this.validDateOfBirthField = Number(age) >= 18;
            }

            return this.validDateOfBirthField
        }

        /**
         * @private
         */
        _loginSuccessfully() {
            this.pendingAdminCheck = true;
            EmailVerifier.isEmailAdmin(this.email)
                .then(() => {
                    this.scope.adminMode = true;
                }, () => {
                    this.scope.adminMode = false;
                })
                .finally(() => {
                    this.scope.user = new User(this.firstName, this.lastName, this.email, this.dateOfBirth);
                    this.scope.loggedIn = true;
                    this.pendingAdminCheck = false;
                });
        }
    }

    angular.module("JOTC").directive('login', [
        '$injector',
        function($injector) {
            User = $injector.get('User');
            EmailVerifier = $injector.get('EmailVerifier');
            return {
                restrict: 'E',
                // Placing the html template directly in here instead of its own file using the "templateUrl" property
                // to avoid wasting time figuring out how the directive can access the html in the testing environment.
                template: `<div>
                            <div ng-show="login.emailVerificationFail" class="feedback-invalid">"{{login.email}}" is not a valid email address.</div>
                            <input class="login-input" ng-class="{'invalid-login': !login.validEmailField}" type="text" placeholder="Email Adress" ng-model="login.email"><br>
                            <input class="login-input" ng-class="{'invalid-login': !login.validFirstNameField}" type="text" placeholder="First Name" ng-model="login.firstName"><br>
                            <input class="login-input" ng-class="{'invalid-login': !login.validLastNameField}" type="text" placeholder="Last Name" ng-model="login.lastName"><br>
                        
                            <div ng-show="!login.validDateOfBirthField" class="feedback-invalid">You must be over 18 to login.</div>
                            <label>When were you born?</label><br>
                            <input class="login-input" ng-class="{'invalid-login': !login.validDateOfBirthField}" type="date" ng-model="login.dateOfBirth"><br>
                        
                            <button class="fancy-button" ng-click="login.onLoginClick()">Login</button>
                        </div>`,
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
