(function() {
    'use strict';
    angular.module('komisja-obwodowa.lista', [])
        .config(config)
        .controller('KOListaController', KOListaController);

    ////////////
    // Config //
    ////////////
    function config($stateProvider) {
        $stateProvider
            .state('komisja-obwodowa-lista', {
                url: '/komisja-obwodowa/lista/{page:[0-9]*}',
                templateUrl: 'app/components/komisja-obwodowa/lista/lista.view.html',
                controller: 'KOListaController as Lista',
                params: {
                    page: {
                        value: '1',
                        squash: true
                    }
                }
            });
    }

    /////////////////
    // Controllers //
    /////////////////
    function KOListaController(KomisjaObwodowaService, SessionService, AlertsService, $location) {
        var vm = this;

        vm.items = [];

        var userId = SessionService.getUserId();
        vm.selectedPkwId = null;
        vm.submitAddCommissionForm = submitAddCommissionForm;
        vm.removeCommission = removeCommission;
        loadCommissions();

        function submitAddCommissionForm(isValid) {
            vm.submitted = true;
            vm.addCommissionForm.submitted = true;
            if (vm.addCommissionForm.$valid) {
                KomisjaObwodowaService.assignCommissionToUser(userId, vm.selectedPkwId)
                    .then(
                        function() {
                            loadCommissions();
                            AlertsService.addSuccess('Komisja została dodana');
                        },
                        function (response) {
                            AlertsService.addError('Nie udało się dodać komisji.');
                        }
                    );
            } else {
                vm.addCommissionForm.submitted = true;
            }
        }

        function loadCommissions() {
            KomisjaObwodowaService.getForUser(userId).then(function(response) {
                if (response.komisje && response.komisje.length) {
                    response.komisje.forEach(function(element, index) {
                        element.index = index + 1;
                    });
                    vm.items = response.komisje;
                }
            }, function(response) {
                AlertsService.addError('Nie udało się pobrać listy komisji. (status: ' +
                    response.status + ' ' + response.statusText + ')');
            });
        }

        function removeCommission(pkwId) {
            KomisjaObwodowaService.removeCommissionFromUser(userId, pkwId)
                .then(
                    function() {
                        loadCommissions();
                        AlertsService.addSuccess('Komisja została skasowana');
                    },
                    function (response) {
                        AlertsService.addError('Nie udało się skasować komisji.');
                    }
                );
        }
    }
})();
