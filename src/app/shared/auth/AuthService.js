/*global app */
'use strict';

function AuthService($http, $q, $location, SessionService, USER_ROLES) {

    var authenticated = false;
    this.isUserAuthenticated = function() {
        return authenticated;
    };
    this.login = function(credentials) {
        var config = {
            headers: {
                'X-OPW-login': credentials.login,
                'X-OPW-password': credentials.password
            }
        };

        return $http.get('/rest-api/service/user/login', config).success(function(data) {
            console.log(data);
            if (data.sessionActive) {
                localStorage.token = data.token;
                localStorage.id = data.id;
                localStorage.login = credentials.login;

                SessionService.create(data.token, data.id, USER_ROLES.guest);

                authenticated = true;
            } else {
                authenticated = false;
            }
        }).error(function() {
            authenticated = false;
        });
    };

    this.logout = function() {
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        authenticated = false;
        console.log(localStorage);
        $location.path('/auth/login');
    };

    this.isUserAuthorized = function(authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }

        return (this.isUserAuthenticated() &&
            authorizedRoles.indexOf(SessionService.userRole) !== -1);
    };

    this.init = function() {

        if (localStorage.token && localStorage.id) {
            authenticated = true;
        }
    };
}
