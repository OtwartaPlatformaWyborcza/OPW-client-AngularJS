(function() {
    'use strict';
    angular.module('auth')
        .controller('LogoutController', LogoutController);
    LogoutController.$inject = ['AuthService'];
    function LogoutController(AuthService) {
        AuthService.logout();
    }
})();
