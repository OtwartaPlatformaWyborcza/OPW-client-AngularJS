(function() {
    'use strict';
    angular
        .module('shared.session')
        .service('SessionService', SessionService);
    SessionService.$inject = ['USER_ROLES'];

    function SessionService(USER_ROLES) {
        var token, userId, userRole;
        var service = {
            create:create,
            destroy:destroy,
            getUserId:getUserId
        };
        init();
        return service;

        function create(parToken, parUserId, parUserRole) {
            token = parToken;
            userId = parUserId;
            userRole = parUserRole;

            localStorage.token = token;
            localStorage.userId = userId;
            localStorage.userRole = userRole;
        }
        function  destroy() {
            token = null;
            userId = null;
            userRole = null;
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
        }
        function getUserId() {
            return userId;
        }
        function init() {
            userRole = USER_ROLES.guest;
            if (localStorage.token) {
                token = localStorage.token;
            }
            if (localStorage.userId) {
                console.log('init user id from localStorage: ' + localStorage.userId);
                userId = localStorage.userId;
            }
            if (localStorage.userRole) {
                userRole = localStorage.userRole;
            }
        }

    }
})();
