(function () {
    'use strict';
    angular
        .module('komisja-obwodowa')
        .service('KomisjaObwodowaService', KomisjaObwodowaService);

    //////////////
    // Services //
    //////////////
    function KomisjaObwodowaService($http, $q) {
        var service = {
            getById: getById,
            getForUser: getForUser,
            uploadProtocol: uploadProtocol,
            getProtocols: getProtocols,
            getProtocolDetails: getProtocolDetails,
            rateProtocolNegative: rateProtocolNegative,
            rateProtocolPositive: rateProtocolPositive
        };
        return service;
        function getById(id) {
            return $http.get('/rest-api/service/komisja/' + id);
        }
        function getForUser(userId) {
            var deferred = $q.defer();

            $http.get('/rest-api/service/user/' + userId + '/obwodowa').then(function(response) {
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
        function getProtocols(pkwId) {
            var deferred = $q.defer();

            $http.get('/rest-api/service/komisja/' + pkwId + '/protokol').then(function(response) {
                deferred.resolve({protocols: response.data});
            });
            return deferred.promise;
        }
        function getProtocolDetails(protocolId) {
            var deferred = $q.defer();
            $http.get('/rest-api/service/wynik/' + protocolId).then(function(response) {
                deferred.resolve({protocol: response.data});
            });
            return deferred.promise;
        }
        function rateProtocolPositive(protocolId) {
            var deferred = $q.defer();
            $http.get('/rest-api/service/wynik/' + protocolId + '/positive').then(
                function(response) {
                    deferred.resolve({protocol: response.data});
                });
            return deferred.promise;
        }
        function rateProtocolNegative(protocolId) {
            var deferred = $q.defer();
            $http.get('/rest-api/service/wynik/' + protocolId + '/negative').then(
                function(response) {
                    deferred.resolve({protocol: response.data});
                });
            return deferred.promise;
        }
    }
})();
