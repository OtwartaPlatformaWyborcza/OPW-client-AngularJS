(function() {
    'use strict';
    angular.module('auth.login', [])
        .config(config)
        .controller('LoginController', LoginController);

    ////////////
    // Config //
    ////////////
    function config($stateProvider, USER_ROLES) {
        $stateProvider
            .state('authlogin', {
                url: '/auth/login',
                templateUrl: 'app/components/auth/login/login.view.html',
                controller: 'LoginController as Login',
                authorizedRoles: [USER_ROLES.guest]
            });
    }

    /////////////////
    // Controllers //
    /////////////////
    function LoginController($location, AuthService, AlertsService) {
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
