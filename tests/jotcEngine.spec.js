describe('JOTC Engine', function() {
    let JOTCEngine;

    beforeEach(angular.mock.module('JOTC'));

    beforeEach(function() {
        angular.mock.inject(function($injector) {
            JOTCEngine = $injector.get('JOTCEngine');
        });
    });

    it('validates number of clouds', function() {
        const expectedOutput = 'The number of clouds must be an integer between 2 and 100.';

        let jotcEngine = new JOTCEngine('', '');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine('not a number', '');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(null, '');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(0, '');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(1, '');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(101, '');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);
    });

    it('validates cloud values', function() {
        const expectedOutput = 'The cloud values must be space-separated integers with values 1 or 0.';

        let jotcEngine = new JOTCEngine(5, null);
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(5, '');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(5, '0 r 1 0');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(5, '01010');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(5, '0    0');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(5, '0 1 2');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(5, '0 0 7');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);
    });

    it('validates that the first and last clouds are 0s', function() {
        const expectedOutput = 'The first and last clouds must be 0s.';

        let jotcEngine = new JOTCEngine(5, '1');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(5, '1 0');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(5, '0 1');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(5, '1 1');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(5, '1 0 1');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(5, '1 0 0 0 0 1 0 0 1');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);
    });

    it('validates that the number of clouds and the length of values match', function() {
        const expectedOutput = 'The number of clouds and the number of values must match.';

        let jotcEngine = new JOTCEngine(3, '0 0');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(4, '0 0 0 1 0');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(2, '0 0');
        expect(jotcEngine.validateInputs()).toBe(true);
    });

    it('validates if the game is winnable', function() {
        const expectedOutput = "There can't be more than one 1 in a row.";

        let jotcEngine = new JOTCEngine(4, '0 1 1 0');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(15, '0 0 0 1 0 1 0 0 0 0 1 1 0 1 0');
        expect(jotcEngine.validateInputs()).toBe(expectedOutput);

        jotcEngine = new JOTCEngine(5, '0 1 0 1 0');
        expect(jotcEngine.validateInputs()).toBe(true);
    });

    it('solves the JOTC game', function() {
        let jotcEngine = new JOTCEngine(7, '0 1 0 0 0 1 0');
        expect(jotcEngine.solve()).toBe(3);

        jotcEngine = new JOTCEngine(7, '0 0 1 0 0 1 0');
        expect(jotcEngine.solve()).toBe(4);

        jotcEngine = new JOTCEngine(6, '0 0 0 0 1 0');
        expect(jotcEngine.solve()).toBe(3);

        jotcEngine = new JOTCEngine(2, '0 0');
        expect(jotcEngine.solve()).toBe(1);

        jotcEngine = new JOTCEngine(3, '0 0 0');
        expect(jotcEngine.solve()).toBe(1);
    });
});
