/*global angular*/
'use strict';
var app = angular.module('opwApp', ['ngRoute']);


app.factory('myHttpAuthInterceptor', ['$rootScope','$q', '$location', 'AUTH','AUTH_EVENTS', function($rootScope,
		$q, $location, AUTH,AUTH_EVENTS) {

    return {
        response: function(response) {

            if (response.headers(AUTH.TOKEN_HEADER_NAME)) {
                localStorage.token = response.headers(AUTH.TOKEN_HEADER_NAME);
                console.log('new token is: ' + localStorage.token);
            }
            return response;
        },

        request: function(config) {
            //console.log('send token: ' + localStorage.token)
            config.headers[AUTH.TOKEN_HEADER_NAME] = localStorage.token;
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
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('myHttpAuthInterceptor');
}])

.run(['$rootScope', 'AUTH_EVENTS', 'AuthService',function($rootScope, AUTH_EVENTS, AuthService) {
    
    if (!AuthService.isUserAuthenticated()){
            AuthService.init();
    }

    $rootScope.$on('$stateChangeStart', function(event, next) {
        var authorizedRoles = next.data.authorizedRoles;
        
        

        if (!AuthService.isUserAuthorized(authorizedRoles)) {
            event.preventDefault();
            if (AuthService.isUserAuthenticated()) {
                // user is not allowed
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            } else {
                // user is not logged in
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }
    });
}]);
