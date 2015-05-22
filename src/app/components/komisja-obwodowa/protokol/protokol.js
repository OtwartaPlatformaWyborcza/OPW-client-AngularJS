(function () {
    'use strict';
    angular
        .module('komisja-obwodowa.protokol', [])
        .config(config)
        .controller('KOProtokolController', KOProtokolController)
        .directive('koProtocolLinkFormMessages', koProtocolLinkFormMessages);

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

    ////////////////
    // Directives //
    ////////////////
    function koProtocolLinkFormMessages() {
        return {
            scope: {
                form: '=',
                name: '@'
            },
            transclude: true,
            templateUrl: 'app/components/komisja-obwodowa/protokol/protokol-photo-link.form-messages.html'
        };
    }

    /////////////////
    // Controllers //
    /////////////////
    function KOProtokolController($stateParams, $location, AlertsService, KomisjaObwodowaService, $window) {
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
        vm.addPhotoLink = addPhotoLink;
        vm.deleteProtocolPhotoLink = deleteProtocolPhotoLink;
        initProtocolData();

        function initProtocolData() {
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
            }
        );
        }
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
        function addPhotoLink(isValid) {
            if (isValid) {
                KomisjaObwodowaService.addProtocolPhotoLink($stateParams.protocolId, vm.photo).then(
                    function() {
                        $window.scrollTo(0, 0);
                        AlertsService.addSuccess('Link został zapisany.');
                        vm.protocol.linkList.push(vm.photo);
                        vm.photo = {};
                        vm.formAddLink.$setPristine();
                        vm.formAddLink.$setUntouched();
                        initProtocolData();
                    },
                    function() {
                        $window.scrollTo(0, 0);
                        AlertsService.addError('Nie udało się zapisać linku.');
                    });
            }
            return false;
        }
        function deleteProtocolPhotoLink(linkId) {
            KomisjaObwodowaService.deleteProtocolPhotoLink($stateParams.protocolId, linkId).then(
                function () {
                    $window.scrollTo(0, 0);
                    AlertsService.addSuccess('Link został skasowany.');
                    initProtocolData();
                },
                function () {
                    $window.scrollTo(0, 0);
                    AlertsService.addError('Nie udało się skasować linku.');
                });
        }

    }
})();

