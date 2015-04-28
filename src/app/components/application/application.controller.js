(function() {
    'use strict';
    angular.module('app')
        .controller('ApplicationController', ApplicationController);
    ApplicationController.$inject = ['USER_ROLES', 'AuthService'];

    function ApplicationController(USER_ROLES, AuthService) {
        var vm = this;
        vm.currentUser = null;
        vm.userRoles = USER_ROLES;
        vm.isAuthorized = AuthService.isAuthorized;
        vm.setCurrentUser = setCurrentUser;
        vm.isUserAuthenticated = isUserAuthenticated;

        function setCurrentUser(user) {
            vm.currentUser = user;
        }
        function isUserAuthenticated() {
            return AuthService.isUserAuthenticated();
        }
    }
})();
