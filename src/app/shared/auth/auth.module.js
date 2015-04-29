(function() {
    'use strict';
    angular.module('shared.auth', [])
        .factory('authInterceptor', authInterceptor)
        .config(addAuthInterceptor)
        .run(authModuleRun);

    authModuleRun.$inject = ['$rootScope', 'AUTH_EVENTS', 'AuthService', '$location'];
    addAuthInterceptor.$inject = ['$httpProvider'];
    authInterceptor.$inject = ['$rootScope', '$q', '$location', 'AUTH',
            'AUTH_EVENTS', 'SessionService'];

    function authModuleRun($rootScope, AUTH_EVENTS, AuthService, $location) {

        if (!AuthService.isUserAuthenticated()) {
            //AuthService.logout();
            //$location.path('/auth/login');
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

    function addAuthInterceptor($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }

    function authInterceptor($rootScope, $q, $location, AUTH,
                            AUTH_EVENTS, SessionService) {
        return {
            request: function(config) {
                //console.log('send token: ' + localStorage.token)
                config.headers[AUTH.TOKEN_HEADER_NAME] = SessionService.getUserToken();
                //no override if it has been set in other components (for example login action)
                if (!config.headers[AUTH.LOGIN_HEADER_NAME]) {
                    config.headers[AUTH.LOGIN_HEADER_NAME] = SessionService.getUserLogin();
                }

                return config;
            },

            responseError: function(response) {
                console.log('responseError status: ' + response.status);
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized,
                    419: AUTH_EVENTS.sessionTimeout,
                    440: AUTH_EVENTS.sessionTimeout
                }[response.status], response);
                return $q.reject(response);
            }
        };
    }
})();
