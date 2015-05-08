(function() {
    'use strict';
    angular
        .module('komisja-obwodowa', [
            'komisja-obwodowa.lista',
            'komisja-obwodowa.protokol',
            'komisja-obwodowa.protokoly'
        ])
        .config(config)
        .directive('koFormMessages', koFormMessages)
        .controller('KomisjaObwodowaController', KomisjaObwodowaController);

    ////////////
    // Config //
    ////////////
    function config($stateProvider) {
        $stateProvider
            .state('komisja-obwodowa', {
                url: '/komisja-obwodowa/{id:[0-9]{4,8}-[0-9]{1,3}}',
                templateUrl: 'app/components/komisja-obwodowa/komisja-obwodowa.view.html',
                controller: 'KomisjaObwodowaController as KO'
            });
    }

    ////////////////
    // Directives //
    ////////////////
    function koFormMessages() {
        return {
            scope: {
                form: '=',
                name: '@'
            },
            transclude: true,
            templateUrl: 'app/components/komisja-obwodowa/komisja-obwodowa.form-messages.html'
        };
    }

    /////////////////
    // Controllers //
    /////////////////
    function KomisjaObwodowaController($stateParams, $location, KomisjaObwodowaService, AlertsService) {

        var vm = this;
        vm.submit = submit;

        vm.votes = {};

        vm.sumCandidateVotes = function() {
            vm.votes.razem = vm.votes.k1 + vm.votes.k2 + vm.votes.k3 + vm.votes.k4 + vm.votes.k5 +
            vm.votes.k6 + vm.votes.k7 + vm.votes.k8 + vm.votes.k9 + vm.votes.k10 + vm.votes.k11;
        };
        vm.sumCandidateVotes();

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
