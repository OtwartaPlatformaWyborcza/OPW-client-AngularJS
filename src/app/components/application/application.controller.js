(function() {
    'use strict';
    angular.module('app')
        .controller('ApplicationController', ApplicationController);
    ApplicationController.$inject = ['$rootScope', 'USER_ROLES', 
            'AuthService', 'AlertsService', 'AUTH_EVENTS'];

    function ApplicationController($rootScope, USER_ROLES, 
            AuthService, AlertsService, AUTH_EVENTS) {
        var vm = this;
        vm.currentUser = null;
        vm.userRoles = USER_ROLES;
        vm.isAuthorized = AuthService.isAuthorized;
        vm.setCurrentUser = setCurrentUser;
        vm.isUserAuthenticated = isUserAuthenticated;
        $rootScope.$on(AUTH_EVENTS.notAuthorized,
                function(event, responseCode) {
                    AlertsService.addError('Zaloguj się ponownie.');
                    AuthService.logout();
                });
        function setCurrentUser(user) {
            vm.currentUser = user;
        }
        function isUserAuthenticated() {
            return AuthService.isUserAuthenticated();
        }
    }
})();
