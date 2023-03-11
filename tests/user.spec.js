describe('User', function() {
    beforeEach(angular.mock.module('JOTC'));

    let User;

    beforeEach(function() {
        angular.mock.inject(function($injector) {
            User = $injector.get('User');
        });
    });

    it('builds the full name', function() {
        const user = new User('first', 'last', '', null);

        expect(user.getFullName()).toBe('first last');
    });
});
