(function() {
    'use strict';
    angular.module('auth')
        .controller('LogoutController', LogoutController);
    LogoutController.$inject = ['AuthService', 'AlertsService'];
    function LogoutController(AuthService, AlertsService) {
        AlertsService.clear();
        AuthService.logout().then(function() {
            AlertsService.addSuccess('Zostałeś wylogowany');
        });
    }
})();
