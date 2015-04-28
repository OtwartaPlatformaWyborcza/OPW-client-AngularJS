(function () {
    'use strict';
    angular
        .module('komisja-obwodowa')
        .service('KomisjaObwodowaService', ['$http', KomisjaObwodowaService]);
    function KomisjaObwodowaService($http) {
        var service = {
            getById: getById,
            getForUser: getForUser,
            uploadProtocol: uploadProtocol
        };
        return service;
        function getById(id) {
            return $http.get('/rest-api/service/komisja/' + id);
        }
        function getForUser(userId) {
            return $http.get('/rest-api/service/user/' + userId + '/obwodowa');
        }
        function uploadProtocol(pkwId, protocolData) {
            return $http({
                method: 'POST',
                url: '/rest-api/service/komisja/' + pkwId + '/protokol',
                data: protocolData
            });
        }
    }
})();
