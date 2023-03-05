(function() {
    const CUMULUS = 0;
    const THUNDERHEAD = 1;
    /**
     */
    class JOTCEngine {

        constructor(numberOfCloudsInput, cloudValuesInput) {
            this.numberOfCloudsInput = Number(numberOfCloudsInput);
            this.cloudValues = (cloudValuesInput == null || cloudValuesInput === '') ?
                [] :
                cloudValuesInput.split(' ').map((value) => value !== '' && Number(value));
        }

        /**
         * Checks if numberOfCloudsInput is a number between 2 and 100
         * @return {boolean}
         * @private
         */
        _checkCloudNumber() {
            return !isNaN(this.numberOfCloudsInput) && 2 <= this.numberOfCloudsInput && this.numberOfCloudsInput <= 100;
        }

        /**
         * Checks if the values are only 1s and 0s
         * @return {boolean}
         * @private
         */
        _checkCloudValues() {
            return this.cloudValues.length > 0 &&
                !this.cloudValues.some((value) => value !== CUMULUS && value !== THUNDERHEAD);
        }

        /**
         * Checks if the first and last values are 0
         * @return {boolean}
         * @private
         */
        _checkFirstAndLastClouds() {
            return this.cloudValues[0] === CUMULUS && this.cloudValues[this.cloudValues.length - 1] === CUMULUS;
        }

        /**
         * Checks if the number input and values size match
         * @return {boolean}
         * @private
         */
        _checkInputsMatch() {
            return this.cloudValues.length === this.numberOfCloudsInput;
        }

        /**
         * Checks if the game is winnable. The game is winnable if there arent more than two 1s in a row.
         * @return {boolean}
         * @private
         */
        _checkGameWinnable() {
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
            if (!this._checkCloudNumber()) {
                return 'The number of clouds must be an integer between 2 and 100.';
            }
            if (!this._checkCloudValues()) {
                return 'The cloud values must be space-separated integers with values 1 or 0.';
            }
            if (!this._checkFirstAndLastClouds()) {
                return 'The first and last clouds must be 0s.';
            }
            if (!this._checkInputsMatch()) {
                return 'The number of clouds and the number of values must match.';
            }
            if (!this._checkGameWinnable()) {
                return "There can't be more than one 1 in a row.";
            }

            return true;
        }

        /**
         * @return {number}
         */
        solve() {
            return this._jump(0, 0);
        }

        /**
         * Solves the JOTC problem with recursion
         * @param {number} currentCloud
         * @param {number} totalJumps
         * @return {number}
         * @private
         */
        _jump(currentCloud, totalJumps) {
            if (currentCloud === this.cloudValues.length - 1) {
                return totalJumps;
            }

            const jumpOne = currentCloud + 1;
            const jumpTwo = currentCloud + 2;

            if (this._canJump(jumpOne) && this._canJump(jumpTwo)) {
                return Math.min(
                    this._jump(jumpOne, totalJumps + 1),
                    this._jump(jumpTwo, totalJumps + 1)
                );
            }

            if (this._canJump(jumpOne)) {
               return this._jump(jumpOne, totalJumps + 1);
            }

            return this._jump(jumpTwo, totalJumps + 1);
        }

        /**
         * @param {number} cloudIndex
         * @return {boolean}
         * @private
         */
        _canJump(cloudIndex) {
            return cloudIndex < this.cloudValues.length && this.cloudValues[cloudIndex] === CUMULUS;
        }
    }

    angular.module("JOTC").factory('JOTCEngine', function() {
            return JOTCEngine;
        }
    );
})();
