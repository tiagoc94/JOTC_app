(function() {
    /**
     */
    class User {
        /**
         * @param {string} firstName
         * @param {string} lastName
         * @param {string} email
         * @param {Date} dateOfBirth
         */
        constructor(firstName, lastName, email, dateOfBirth) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.dateOfBirth = dateOfBirth;
        }

        /**
         * @return {string}
         */
        getFullName() {
            return `${this.firstName} ${this.lastName}`;
        }

    }

    angular.module("JOTC").factory('User', function() {
            return User;
        }
    );
})();
