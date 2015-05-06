(function() {
    'use strict';
    angular.module('auth.logout', [])
        .controller('LogoutController', LogoutController);

    ////////////
    // Config //
    ////////////
    function routesConfig($stateProvider) {
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
