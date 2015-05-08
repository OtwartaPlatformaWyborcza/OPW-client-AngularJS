(function() {
    'use strict';
    angular
        .module('komisja-obwodowa.protokoly', [])
        .config(config)
        .controller('KOWgraneProtokolyController', KOWgraneProtokolyController);

    ////////////
    // Config //
    ////////////
    function config($stateProvider) {
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
        var vm = this;

        vm.commisionId = $stateParams.id;
        KomisjaObwodowaService.getProtocols($stateParams.id).then(
            function(response) {
                if (response.protocols && response.protocols.length) {
                    response.protocols.forEach(function(element, index) {
                        element.index = index + 1;
                    });

                    vm.protocols = response.protocols;
                }
            },
            function() {
                AlertsService.addError('Nie udało się pobrac listy protokolow dla komisji: ' +
                    $stateParams.id);
            });
    }
})();
