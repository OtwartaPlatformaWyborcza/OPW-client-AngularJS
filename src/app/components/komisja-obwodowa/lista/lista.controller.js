(function() {
    'use strict';
    angular.module('komisja-obwodowa')
        .controller('KOListaController', KOListaController);

    KOListaController.$inject = ['$stateParams', 'KomisjaObwodowaService',
        'SessionService', 'AlertsService', '$location'];

    function KOListaController($stateParams, KomisjaObwodowaService, SessionService,
        AlertsService, $location) {
        var vm = this,
            currentPage = parseInt($stateParams.page, 10),
            lastPage,
            itemsPerPage = 6,
            visibleFrom = 0,
            visibleTo = 10,
            items;
        var userId = SessionService.getUserId();
        vm.selectedPkwId = null;
        vm.submitManualCommissionSelectionForm = submitManualCommissionSelectionForm;
        KomisjaObwodowaService.getForUser(userId).then(function(response) {
            items = response.komisje;
            visibleFrom = Math.floor(itemsPerPage * (currentPage - 1));
            visibleTo = visibleFrom + itemsPerPage;
            lastPage = Math.ceil(items.length / itemsPerPage);

            vm.items = items;
            vm.visibleFrom = visibleFrom;
            vm.visibleTo = visibleTo;
            vm.itemsPerPage = itemsPerPage;
            vm.currentPage = currentPage;
            vm.lastPage = lastPage;
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
