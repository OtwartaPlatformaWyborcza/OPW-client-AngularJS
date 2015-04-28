(function() {
    'use strict';
    angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
                            'USER_ROLES', routesConfig]);
    //routesConfig.$inject = [];
    function routesConfig($stateProvider, $urlRouterProvider, $locationProvider, USER_ROLES) {

        $urlRouterProvider.otherwise('/auth/login');
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('authlogin', {
                url: '/auth/login',
                templateUrl: 'app/components/auth/login.view.html',
                controller: 'LoginController as vm',
                authorizedRoles: [USER_ROLES.guest]
            })

        .state('komisja-obwodowa', {
            url: '/komisja-obwodowa/{id:[0-9]{4,8}-[0-9]{1,2}}',
            templateUrl: 'app/components/komisja-obwodowa/komisja-obwodowa.view.html',
            controller: 'KomisjaObwodowaController as vm'
        })

        .state('komisja-obwodowa-protokoly', {
            url: '/komisja-obwodowa/{id:[0-9]{4}-[0-9]{1,2}}/wgrane-protokoly',
            templateUrl: 'app/components/komisja-obwodowa/' +
                    'wgrane-protokoly/wgrane-protokoly.view.html',
            controller: 'KOWgraneProtokolyController as vm'
        })

        .state('komisja-obwodowa-lista', {
            url: '/komisja-obwodowa/lista/{page:[0-9]*}',
            templateUrl: 'app/components/komisja-obwodowa/lista/lista.view.html',
            controller: 'KOListaController as vm',
            params: {
                page: {
                    value: 1,
                    squash: true
                }
            }
        })

        .state('authlogout', {
            url: '/auth/logout',
            template: '',
            controller: 'LogoutController'
        });
    }
})();
