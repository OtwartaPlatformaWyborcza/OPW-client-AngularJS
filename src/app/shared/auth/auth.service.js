(function() {
    'use strict';
    angular.module('shared.auth')
            .service('AuthService', AuthService);

    //////////////
    // Services //
    //////////////
    function AuthService($http, $q, $location, SessionService, USER_ROLES) {
        var authenticated = false;
        var service = {
            isUserAuthenticated: isUserAuthenticated,
            login: login,
            logout: logout,
            isUserAuthorized: isUserAuthorized,
            init: init
        };
        return service;
        function isUserAuthenticated() {
            return authenticated;
        }
        function  login(credentials) {
            var config = {
                headers: {
                    'X-OPW-login': credentials.login,
                    'X-OPW-password': credentials.password
                }
            };

            return $http.get('/rest-api/service/user/login', config).success(function(data) {
                if (data.sessionActive) {
                    SessionService.create(data.token, data.id, USER_ROLES.guest, data.login);
                    authenticated = true;
                } else {
                    authenticated = false;
                }
            }).error(function() {
                authenticated = false;
            });
        }

        function logout() {
            authenticated = false;
            var deferred = $q.defer();
            $http.get('/rest-api/service/user/logout').then(
                function(response) {
                    SessionService.destroy();
                    deferred.resolve(response);
                    $location.path('/auth/login');
                },
                function () {
                    $location.path('/auth/login');
                });
            return deferred.promise;
        }

        function isUserAuthorized(authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (isUserAuthenticated() &&
                authorizedRoles.indexOf(SessionService.userRole) !== -1);
        }

        function init() {
            if (localStorage.token && localStorage.userId) {
                authenticated = true;
            }
        }
    }
})();
