'use strict';

function AuthInterceptor($rootScope, $q, $location, AUTH, AUTH_EVENTS, AuthService) {

    return {
        request: function(config) {
            //console.log('send token: ' + localStorage.token)
            config.headers[AUTH.TOKEN_HEADER_NAME] = localStorage.token;
            //no override if it has been set in other components (for example login action)
            if (!config.headers[AUTH.LOGIN_HEADER_NAME]) {
                config.headers[AUTH.LOGIN_HEADER_NAME] = localStorage.login;
            }

            return config;
        },

        responseError: function(response) {
            console.log('response status: ' + response.status);
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
