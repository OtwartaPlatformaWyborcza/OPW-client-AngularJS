'use strict';

function runConfig($rootScope, $location, AuthService) {
    $rootScope.$on('$routeChangeStart',
        function(event, next, current) {
            if (!AuthService.isUserAuthenticated() && $location.path() !== '/auth/login') {
                console.log('User not authorized, redirect to login page');
                $location.path('/auth/login');
            } else if (true) {
                //sprawdzic czy rola uzytkownika jest w next.authorizedRoles
                console.log('trzeba sprawdzic czy rola uzytkownika jest w next.authorizedRoles');
            }

        }
    );
}
