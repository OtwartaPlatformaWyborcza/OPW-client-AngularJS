(function() {
    'use strict';
    angular.module('shared.auth', [])
        .factory('authInterceptor', authInterceptor)
        .config(addAuthInterceptor)
        .constant('USER_ROLES', {
            admin: 'admin',
            user: 'user',
            guest: 'guest'
        })
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        })
        .constant('AUTH', {
            TOKEN_HEADER_NAME: 'X-OPW-token',
            LOGIN_HEADER_NAME: 'X-OPW-login',
            PASSWORD_HEADER_NAME: 'X-OPW-password'
        })
        .run(authModuleRun);

    ////////////
    // Config //
    ////////////
    function addAuthInterceptor($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }

    function authInterceptor($q, $rootScope, $location, AUTH,
                             SessionService, AUTH_EVENTS) {
        return {
            request: function(config) {
                config.headers[AUTH.TOKEN_HEADER_NAME] = SessionService.getUserToken();
                //no override if it has been set in other components (for example login action)
                if (!config.headers[AUTH.LOGIN_HEADER_NAME]) {
                    config.headers[AUTH.LOGIN_HEADER_NAME] = SessionService.getUserLogin();
                }

                return config;
            },

            responseError: function(response) {
                console.log(response.status);
                if (parseInt(response.status, 10) ===  401) {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, response.status);
                }
                return $q.reject(response);
            }
        };
    }

    /////////
    // Run //
    /////////
    function authModuleRun($rootScope, AUTH_EVENTS, AuthService, $location) {

        if (!AuthService.isUserAuthenticated()) {
            AuthService.init();
            $location.path($location.path());
        }

        $rootScope.$on('$stateChangeStart', function(event, next) {
            var authorizedRoles = next.authorizedRoles;

            if (!AuthService.isUserAuthorized(authorizedRoles)) {
                //event.preventDefault();
                if (AuthService.isUserAuthenticated()) {
                    // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    console.log('user notAuthenticated');
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
        });
    }
})();
