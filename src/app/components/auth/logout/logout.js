(function() {
    'use strict';
    angular.module('auth.logout', [])
        .config(config)
        .controller('LogoutController', LogoutController);

    ////////////
    // Config //
    ////////////
    function config($stateProvider) {
        $stateProvider
            .state('authlogout', {
                url: '/auth/logout',
                template: '',
                controller: 'LogoutController'
            });
    }

    /////////////////
    // Controllers //
    /////////////////
    function LogoutController(AuthService, AlertsService) {
        AlertsService.clear();
        AuthService.logout().then(function() {
            AlertsService.addSuccess('Zostałeś wylogowany');
        });
    }
})();
