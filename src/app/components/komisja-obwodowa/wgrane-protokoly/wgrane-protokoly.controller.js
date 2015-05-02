(function() {
    'use strict';
    angular
        .module('komisja-obwodowa')
        .controller('KOWgraneProtokolyController', KOWgraneProtokolyController);
    KOWgraneProtokolyController.$inject = ['$stateParams', 'KomisjaObwodowaService',
             'AlertsService'];
    function KOWgraneProtokolyController($stateParams, KomisjaObwodowaService, AlertsService) {
        var vm = this,
                currentPage = parseInt($stateParams.page, 10),
                lastPage,
                itemsPerPage = 6,
                visibleFrom = 0,
                visibleTo = 10;
        KomisjaObwodowaService.getProtocols($stateParams.id).then(
            function(response) {
                vm.protocols = response.protocols;
                visibleFrom = Math.floor(itemsPerPage * (currentPage - 1));
                visibleTo = visibleFrom + itemsPerPage;
                lastPage = Math.ceil(response.protocols.length / itemsPerPage);

                vm.visibleFrom = visibleFrom;
                vm.visibleTo = visibleTo;
                vm.itemsPerPage = itemsPerPage;
                vm.currentPage = currentPage;
                vm.lastPage = lastPage;

            },
            function() {
                AlertsService.addError('Nie udało się pobrac listy protokolow dla komisji: ' +
                    $stateParams.id);
            });
    }
})();
