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
        vm.submitManualCommissionSelectionForm = submitManualCommissionSelectionForm;
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

        function submitManualCommissionSelectionForm(isValid) {
            vm.submitted = true;
            vm.manualCommissionSelectionForm.submitted = true;
            if (vm.manualCommissionSelectionForm.$valid) {
                $location.path('/komisja-obwodowa/' + vm.selectedPkwId);
            } else {
                vm.manualCommissionSelectionForm.submitted = true;
            }
        }
    }
})();
