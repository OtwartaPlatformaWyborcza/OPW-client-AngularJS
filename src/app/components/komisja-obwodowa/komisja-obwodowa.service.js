(function () {
    'use strict';
    angular
        .module('komisja-obwodowa')
        .service('KomisjaObwodowaService', ['$http', '$q', KomisjaObwodowaService]);
    function KomisjaObwodowaService($http, $q) {
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
            var deferred = $q.defer();

            $http.get('/rest-api/service/user/' + userId + '/obwodowa').then(function(response) {
                console.log('poszlo ok');
                console.log(response);
                deferred.resolve({komisje: response.data});
            });
            return deferred.promise;
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
