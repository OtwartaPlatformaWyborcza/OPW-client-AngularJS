(function() {
    'use strict';
    angular
        .module('app', ['ui.router', 'shared.auth', 'shared.alerts', 'shared.controls.pagination',
                        'shared.session', 'shared.table', 'auth', 'komisja-obwodowa'])
        .run(['$rootScope', '$location', 'AuthService', runConfig])
        .constant('USER_ROLES', {
            admin: 'admin',
            user: 'user',
            guest: 'guest'
        });

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
