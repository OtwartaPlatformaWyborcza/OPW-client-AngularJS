(function() {
    'use strict';
    angular.module('auth')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['$location', 'AuthService', 'AlertsService'];

    function LoginController($location, AuthService, AlertsService) {
        var vm = this;
        if (AuthService.isUserAuthenticated()) {
            $location.path('/komisja-obwodowa/lista');
        }

        vm.credentials = {};
        vm.login = function() {

            AuthService.login(vm.credentials)
                .then(
                    function(response) {
                        if (response.status === 200) {

                            $location.path('/komisja-obwodowa/lista');
                        } else {
                            AlertsService.addError('Błędne dane logowania');
                        }

                    },
                    function() {
                        AlertsService.addError('Błędne dane logowania');
                    });

        };
    }
})();
