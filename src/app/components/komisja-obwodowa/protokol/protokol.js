(function () {
    'use strict';
    angular
        .module('komisja-obwodowa.protokol', [])
        .config(config)
        .controller('KOProtokolController', KOProtokolController);

    ////////////
    // Config //
    ////////////
    function config($stateProvider) {
        $stateProvider
            .state('komisja-obwodowa-protokol', {
                url: '/komisja-obwodowa/{commisionId:[0-9]{4,8}-[0-9]{1,4}}' +
                '/protokol/{protocolId:[0-9]*}',
                templateUrl: 'app/components/komisja-obwodowa/protokol/protokol.view.html',
                controller: 'KOProtokolController as Protokol'
            });
    }

    /////////////////
    // Controllers //
    /////////////////
    function KOProtokolController($stateParams, $location, AlertsService, KomisjaObwodowaService) {
        var vm = this;
        vm.labels = {
            uprawnionych : 'Uprawnionych do głosowania',
            glosujacych: 'Głosujących',
            kartWaznych: 'Kart ważnych',
            glosowNieWaznych: 'Głosów nieważnych',
            glosowWaznych: 'Głosów ważnych'
        };
        vm.ratePositive = ratePositive;
        vm.rateNegative = rateNegative;
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
        function ratePositive() {
            KomisjaObwodowaService.rateProtocolPositive($stateParams.protocolId)
                .then(rateResultSuccess, rateResultFailure);
        }
        function rateNegative() {
            KomisjaObwodowaService.rateProtocolNegative($stateParams.protocolId)
                .then(rateResultSuccess, rateResultFailure);
        }
        function rateResultSuccess() {
            AlertsService.addSuccess('Głos został przyjęty.');
            $location.path('komisja-obwodowa/' + $stateParams.commisionId + '/wgrane-protokoly/');
        }
        function rateResultFailure() {
            AlertsService.addSuccess('Wystąpił błąd. Głos nie został przyjęty.');
            $location.path('komisja-obwodowa/' + $stateParams.commisionId + '/wgrane-protokoly/');
        }

    }
})();

