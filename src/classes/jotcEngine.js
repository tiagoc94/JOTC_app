(function() {
    const CUMULUS = 0;
    const THUNDERHEAD = 1;
    /**
     */
    class JOTCEngine {

        constructor(numberOfCloudsInput, cloudValuesInput) {
            this.numberOfCloudsInput = Number(numberOfCloudsInput);
            this.cloudValues = cloudValuesInput.split(' ').map((value) => Number(value));
        }

        /**
         * Checks if numberOfCloudsInput is a number between 2 and 100
         * @return {boolean}
         */
        checkCloudNumber() {
            return !isNaN(this.numberOfCloudsInput) && 2 <= this.numberOfCloudsInput && this.numberOfCloudsInput <= 100;
        }

        /**
         * Checks if the values are only 1s and 0s
         * @return {boolean}
         */
        checkCloudValues() {
            return !this.cloudValues.some((value) => value !== CUMULUS && value !== THUNDERHEAD);
        }

        /**
         * Checks if the first and last values are 0
         * @return {boolean}
         */
        checkFirstAndLastClouds() {
            return this.cloudValues[0] === CUMULUS && this.cloudValues[this.cloudValues.length - 1] === CUMULUS;
        }

        /**
         * Checks if the number input and values size match
         * @return {boolean}
         */
        checkInputsMatch() {
            return this.cloudValues.length === this.numberOfCloudsInput;
        }

        /**
         * Checks if the game is winnable. The game is winnable if there arent more than two 1s in a row.
         * @return {boolean}
         */
        checkGameWinnable() {
            let thunderheadsInARow = 0;
            const limit = 2;

            for (const cloudValue of this.cloudValues) {
                if (cloudValue === CUMULUS) {
                    thunderheadsInARow = 0;
                    continue;
                }

                thunderheadsInARow++;
                if (thunderheadsInARow === limit) {
                    return false;
                }
            }

            return true;
        }

        /**
         * Returns a feedback message if a game rule is broken or true otherwise.
         * @return {string|boolean}
         */
        validateInputs() {
            if (!this.checkCloudNumber()) {
                return 'The number of clouds must be an integer between 2 and 100.'
            }
            if (!this.checkCloudValues()) {
                return 'The cloud values must be space-separated integers with values 1 or 0.'
            }
            if (!this.checkFirstAndLastClouds()) {
                return 'The first and last clouds must be 0s.'
            }
            if (!this.checkInputsMatch()) {
                return 'The number of clouds and the number of values must match.'
            }
            if (!this.checkGameWinnable()) {
                return "There can't be more than one 1 in a row.";
            }

            return true;
        }

        solve() {
            // TODO: implement
            return 5;
        }
    }

    angular.module("JOTC").factory('JOTCEngine', function() {
            return JOTCEngine;
        }
    );
})();
