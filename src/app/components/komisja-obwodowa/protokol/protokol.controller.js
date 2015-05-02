(function () {
    'use strict';
    angular
        .module('komisja-obwodowa')
        .controller('KOProtokolController', KOProtokolController);

    KOProtokolController.$inject = ['$stateParams', 'AlertsService', 'KomisjaObwodowaService'];
    function KOProtokolController($stateParams, AlertsService, KomisjaObwodowaService) {
        var vm = this;
        vm.labels = {
            uprawnionych : 'Uprawnionych do głosowania',
            glosujacych: 'Głosujących',
            kartWaznych: 'Kart ważnych',
            glosowNieWaznych: 'Głosów nieważnych',
            glosowWaznych: 'Głosów ważnych'
        };
        KomisjaObwodowaService.getProtocolDetails($stateParams.protocolId).then(
            function(response) {
                vm.protocol = response.protocol;
                KomisjaObwodowaService.getById($stateParams.commisionId).then(
                    function(response) {
                        vm.commision = response.data;
                    },
                    function() {
                        AlertsService.addError('Nie udało się pobrac danych komisji.');
                    });
            },
            function() {
                AlertsService.addError('Nie udało się pobrac danych protokołu.');
            });
    }
})();

