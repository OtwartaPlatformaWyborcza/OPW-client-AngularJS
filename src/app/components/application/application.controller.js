(function() {
    'use strict';
    angular.module('app')
        .controller('ApplicationController', ApplicationController);
    ApplicationController.$inject = ['$rootScope', 'USER_ROLES', 'AuthService', 'AlertsService'];

    function ApplicationController($rootScope, USER_ROLES, AuthService, AlertsService) {
        var vm = this;
        vm.currentUser = null;
        vm.userRoles = USER_ROLES;
        vm.isAuthorized = AuthService.isAuthorized;
        vm.setCurrentUser = setCurrentUser;
        vm.isUserAuthenticated = isUserAuthenticated;
        $rootScope.$on('HTTP_REQUEST_ERROR',
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
