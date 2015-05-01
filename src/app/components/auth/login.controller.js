(function() {
    'use strict';
    angular.module('auth')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['$location', 'AuthService',
                        'AlertsService', 'AUTH_EVENTS', '$rootScope'];

    function LoginController($location, AuthService, AlertsService, AUTH_EVENTS, $rootScope) {
        var vm = this;

        if (AuthService.isUserAuthenticated()) {
            AlertsService.clear();
            $location.path('/komisja-obwodowa/lista');
        }

        vm.credentials = {};
        vm.login = function() {

            AuthService.login(vm.credentials)
                .then(
                    function(response) {
                        console.log('login response:');
                        console.log(response);
                        if (response.status === 200) {
                            AlertsService.clear();
                            $location.path('/komisja-obwodowa/lista');
                        } else {
                            AlertsService.addError('Błędne dane logowania 1');
                        }

                    },
                    function() {
                        AlertsService.addError('Błędne dane logowania');
                    });

        };
    }
})();
