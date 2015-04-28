(function () {
    'use strict';
    angular
        .module('komisja-obwodowa')
        .service('KomisjaObwodowaService', ['$http', KomisjaObwodowaService]);
    function KomisjaObwodowaService($http) {
        var service = {
            getById: getById,
            getForUser: getForUser,
        };
        return service;
        function getById(id) {
            return $http.get('/rest-api/service/komisja/' + id);
        }
        function getForUser(userId) {
            return $http.get('/rest-api/service/user/' + userId + '/obwodowa');
        }
    }
})();
