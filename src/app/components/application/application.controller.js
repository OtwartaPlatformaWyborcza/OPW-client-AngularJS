(function() {
    'use strict';
    angular.module('app')
        .controller('ApplicationController', ApplicationController);

    function ApplicationController($rootScope, USER_ROLES, AuthService, AlertsService, 
                                SessionService, AUTH_EVENTS) {
        var vm = this;
        vm.isAuthorized = AuthService.isAuthorized;
        vm.userLogin = SessionService.getUserLogin();
        vm.isUserAuthenticated = isUserAuthenticated;
        $rootScope.$on(AUTH_EVENTS.notAuthorized,
                function(event, responseCode) {
                    if (AuthService.isUserAuthenticated()) {
                        AlertsService.addError('Zaloguj się ponownie.');
                        AuthService.logout();
                    }
                });
        function isUserAuthenticated() {
            return AuthService.isUserAuthenticated();
        }
    }
})();
