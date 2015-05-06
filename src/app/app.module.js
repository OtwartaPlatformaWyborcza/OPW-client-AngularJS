(function() {
    'use strict';
    angular
        .module('app', [
            'ui.router',
            'shared.auth',
            'shared.alerts',
            'shared.controls.pagination',
            'shared.session',
            'shared.validators',
            'shared.table',
            'auth',
            'komisja-obwodowa'
        ])
        .config(routesConfig)
        .run(['$rootScope', '$location', 'AuthService', runConfig]);

    ////////////
    // Config //
    ////////////
    function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/auth/login');
        $locationProvider.html5Mode(true);
    }

    /////////
    // Run //
    /////////
    function runConfig($rootScope, $location, AuthService) {
        $rootScope.$on('$routeChangeStart',
            function(event, next, current) {
                if (!AuthService.isUserAuthenticated() && $location.path() !== '/auth/login') {
                    console.log('User not authorized, redirect to login page');
                    $location.path('/auth/login');
                }
            }
        );
    }
})();
