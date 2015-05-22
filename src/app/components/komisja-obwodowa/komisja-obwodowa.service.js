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
            rateProtocolPositive: rateProtocolPositive,
            assignCommissionToUser: assignCommissionToUser,
            removeCommissionFromUser: removeCommissionFromUser,
            deleteProtocolPhotoLink: deleteProtocolPhotoLink,
            addProtocolPhotoLink: addProtocolPhotoLink
        };
        return service;
        function getById(id) {
            return $http.get('/opw/service/komisja/' + id);
        }
        function getForUser(userId) {
            var deferred = $q.defer();

            $http.get('/opw/service/user/' + userId + '/obwodowa').then(function(response) {
                deferred.resolve({komisje: response.data});
            });
            return deferred.promise;
        }
        function uploadProtocol(pkwId, protocolData) {
            return $http({
                method: 'POST',
                url: '/opw/service/komisja/' + pkwId + '/protokol',
                data: protocolData
            });
        }
        function getProtocols(pkwId) {
            var deferred = $q.defer();

            $http.get('/opw/service/komisja/' + pkwId + '/protokol').then(function(response) {
                deferred.resolve({protocols: response.data});
            });
            return deferred.promise;
        }
        function getProtocolDetails(protocolId) {
            var deferred = $q.defer();
            $http.get('/opw/service/wynik/' + protocolId).then(function(response) {
                deferred.resolve({protocol: response.data});
            });
            return deferred.promise;
        }
        function rateProtocolPositive(protocolId) {
            var deferred = $q.defer();
            $http.get('/opw/service/wynik/' + protocolId + '/positive').then(
                function(response) {
                    deferred.resolve({protocol: response.data});
                });
            return deferred.promise;
        }
        function rateProtocolNegative(protocolId) {
            var deferred = $q.defer();
            $http.get('/opw/service/wynik/' + protocolId + '/negative').then(
                function(response) {
                    deferred.resolve({protocol: response.data});
                });
            return deferred.promise;
        }
        function assignCommissionToUser(userId, commissionId) {
            var deferred = $q.defer();
            $http.put('/opw/service/user/' + userId + '/obwodowa/' + commissionId).then(
                function(response) {
                    deferred.resolve({protocol: response.data});
                });
            return deferred.promise;
        }
        function removeCommissionFromUser(userId, commissionId) {
            var deferred = $q.defer();
            $http.delete('/opw/service/user/' + userId + '/obwodowa/' + commissionId).then(
                function(response) {
                    deferred.resolve({protocol: response.data});
                });
            return deferred.promise;
        }
        function deleteProtocolPhotoLink(protocolId, linkId) {
            var deferred = $q.defer();
            $http.delete('/opw/service/wynik/' + protocolId + '/link/' + linkId).then(
                function(response) {
                    deferred.resolve({protocol: response.data});
                });
            return deferred.promise;
        }
        function addProtocolPhotoLink(protocolId, photoUrlData) {
            var deferred = $q.defer();
            $http.post('/opw/service/wynik/' + protocolId + '/link/', photoUrlData).then(
                function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }
    }
})();
