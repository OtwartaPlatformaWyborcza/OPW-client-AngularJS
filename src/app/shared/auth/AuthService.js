/*global app */
'use strict';
app.service('AuthService', ['$http', '$q', '$location', 'SessionService', 'USER_ROLES', function($http, $q, $location, SessionService,
    USER_ROLES) {
    var authenticated = false;
    this.isUserAuthenticated = function() {
        return authenticated;
    }
    this.login = function(credentials) {
        var config = {
            headers: {
                'login': credentials.login,
                'password': credentials.password
            }
        };



        return $http.get('/rest-api/service/user/login', config).success(function(data) {
            if (data.activeSession) {
                localStorage.token = data.token;
                localStorage.id = data.id;

                
                SessionService.create(data.token, data.id, USER_ROLES.admin);
                
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

    this.isAuthorized = function(authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (this.isUserAuthenticated() &&
            authorizedRoles.indexOf(SessionService.userRole) !== -1);
    };

    this.init = function(){

        if(localStorage.token && localStorage.id ){
            authenticated = true;
        } 
    };



}]);
