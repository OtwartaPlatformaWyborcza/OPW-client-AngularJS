(function() {
    'use strict';
    angular
        .module('app', [
            //vendor
            'ngMessages',
            'angular-loading-bar',
            'ui.router',

            //app
            'shared.auth',
            'shared.alerts',
            'shared.utilities',
            'shared.session',
            'shared.form',
            'shared.table',
            'auth',
            'komisja-obwodowa'
        ])
        .config(config)
        .run(['$rootScope', '$location', 'AuthService', runConfig]);

    ////////////
    // Config //
    ////////////
    function config($urlRouterProvider, $locationProvider, cfpLoadingBarProvider) {

        $urlRouterProvider.otherwise('/auth/login');
        $locationProvider.html5Mode(true);

        cfpLoadingBarProvider.includeSpinner = false;
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
