(function() {
    'use strict';
    angular
        .module('komisja-obwodowa.protokoly', [])
        .config(routesConfig)
        .controller('KOWgraneProtokolyController', KOWgraneProtokolyController);

    ////////////
    // Config //
    ////////////
    function routesConfig($stateProvider) {
        $stateProvider
            .state('komisja-obwodowa-protokoly', {
                url: '/komisja-obwodowa/{id:[0-9]{4,8}-[0-9]{1,3}}/wgrane-protokoly/{page:[0-9]*}',
                templateUrl: 'app/components/komisja-obwodowa/' +
                'wgrane-protokoly/wgrane-protokoly.view.html',
                controller: 'KOWgraneProtokolyController as Protokoly',
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
    function KOWgraneProtokolyController($stateParams, KomisjaObwodowaService, AlertsService) {
        var vm = this,
                currentPage = parseInt($stateParams.page, 10),
                lastPage,
                itemsPerPage = 6,
                visibleFrom = 0,
                visibleTo = 10;
        vm.commisionId = $stateParams.id;
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
