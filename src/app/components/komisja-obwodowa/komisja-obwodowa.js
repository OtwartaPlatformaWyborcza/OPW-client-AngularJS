(function() {
    'use strict';
    angular
        .module('komisja-obwodowa', [
            'komisja-obwodowa.lista',
            'komisja-obwodowa.protokol',
            'komisja-obwodowa.protokoly'
        ])
        .config(routesConfig)
        .controller('KomisjaObwodowaController', KomisjaObwodowaController);

    ////////////
    // Config //
    ////////////
    function routesConfig($stateProvider) {
        $stateProvider
            .state('komisja-obwodowa', {
                url: '/komisja-obwodowa/{id:[0-9]{4,8}-[0-9]{1,3}}',
                templateUrl: 'app/components/komisja-obwodowa/komisja-obwodowa.view.html',
                controller: 'KomisjaObwodowaController as KO'
            });
    }

    /////////////////
    // Controllers //
    /////////////////
    function KomisjaObwodowaController($stateParams, $location, KomisjaObwodowaService, AlertsService) {

        var vm = this;
        vm.submit = submit;
        vm.votes = {
                    glosowWaznych: 100,
                    glosujacych: 10,
                    k1: 12,
                    k2: 3,
                    k3: 13,
                    k4: 12,
                    k5: 16,
                    k6: 12,
                    k7: 18,
                    k8: 15,
                    k9: 18,
                    k10: 19,
                    k11: 15,
                    glosowNieWaznych: 17,
                    kartWaznych: 11,
                    uprawnionych: 661
                };

        vm.labels = {
            uprawnionych : 'Uprawnionych do głosowania',
            glosujacych: 'Głosujących',
            kartWaznych: 'Kart ważnych',
            glosowNieWaznych: 'Głosów nieważnych',
            glosowWaznych: 'Głosów ważnych'
        };

        vm.numbers = [];
        KomisjaObwodowaService.getById($stateParams.id).then(function(response) {
            vm.data = JSON.stringify(response.data);
            vm.komisja = response.data;

        }, function(response) {
            if (parseInt(response.status, 10) === 404) {
                AlertsService.addError('Wybrana komisja nie istnieje.');
            } else {
                AlertsService.addError('Nie udało się pobrać danych komisji. (status: ' +
                response.status + ' ' + response.statusText + ')');
            }
            $location.path('/komisja-obwodowa/lista');
        });

        function submit(isValid) {
            vm.submitted = true;
            console.log(vm.form);
            if (vm.form.$valid) {
                console.log(vm.votes);
                KomisjaObwodowaService.uploadProtocol($stateParams.id, vm.votes).then(
                    function(response) {
                        if (response.status === 200) {
                            $location.path('/komisja-obwodowa/lista');
                            AlertsService.addSuccess('Dane zostały przesłane na serwer.');
                        } else {
                            AlertsService.addError('Błąd podczas przesyłania danych.');
                        }
                    },
                    function() {
                        AlertsService.addError('Błąd podczas przesyłania danych');
                    });
            } else {
                vm.form.submitted = true;
            }
        }
    }
})();
