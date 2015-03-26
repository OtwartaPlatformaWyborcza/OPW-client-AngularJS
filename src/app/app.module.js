/*global angular*/
'use strict';
var app = angular.module('opwApp', ['ngRoute']);


app.factory('myHttpAuthInterceptor', ['$q', '$location', 'AUTH', function($q, $location, AUTH) {


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
        }
    };
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('myHttpAuthInterceptor');
}]);