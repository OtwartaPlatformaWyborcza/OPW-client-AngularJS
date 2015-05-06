(function() {
    'use strict';
    angular.module('shared.session', [])
        .service('SessionService', SessionService);

    //////////////
    // Services //
    //////////////
    function SessionService(USER_ROLES) {
        var token, userId, userRole, userLogin;
        var service = {
            create:create,
            destroy:destroy,
            getUserId:getUserId,
            getUserToken:getUserToken,
            getUserLogin:getUserLogin
        };
        init();
        return service;

        function create(parToken, parUserId, parUserRole, parUserLogin) {
            token = parToken;
            userId = parUserId;
            userRole = parUserRole;
            userLogin = parUserLogin;

            localStorage.token = token;
            localStorage.userId = userId;
            localStorage.userRole = userRole;
            localStorage.userLogin = userLogin;
        }
        function  destroy() {
            token = null;
            userId = null;
            userRole = null;
            userLogin = null;
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userLogin');
        }
        function getUserId() {
            if (localStorage.userId) {
                return localStorage.userId;
            }
            return userId;
        }
        function getUserToken() {
            if (localStorage.token) {
                return localStorage.token;
            }
            return token;
        }
        function getUserLogin() {
            if (localStorage.userLogin) {
                return localStorage.userLogin;
            }
            return userLogin;
        }
        function init() {
            userRole = USER_ROLES.guest;
            if (localStorage.token) {
                token = localStorage.token;
            }
            if (localStorage.userId) {
                userId = localStorage.userId;
            }
            if (localStorage.userRole) {
                userRole = localStorage.userRole;
            }
            if (localStorage.userLogin) {
                userLogin = localStorage.userLogin;
            }
        }
    }
})();
