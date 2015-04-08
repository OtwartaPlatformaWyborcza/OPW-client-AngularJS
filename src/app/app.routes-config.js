'use strict';

function routesConfig($stateProvider, $urlRouterProvider,$locationProvider,USER_ROLES){
      
      $urlRouterProvider.otherwise('/auth/login');
      $locationProvider.html5Mode(true);
      
      $stateProvider
        .state('authlogin', {
            url: '/auth/login',
            templateUrl: 'app/components/auth/login/LoginView.html',
            controller: 'LoginController',
            authorizedRoles: [USER_ROLES.guest]
        })
        
        .state('komisja-obwodowa', {
            url: '/komisja-obwodowa/{id:[0-9]{4}-[0-9]{1,2}}',
            templateUrl: 'app/components/komisja-obwodowa/KomisjaObwodowaView.html',
            controller: 'KomisjaObwodowaController as vm'
        })

        .state('komisja-obwodowa-protokoly', {
            url: '/komisja-obwodowa/{id:[0-9]{4}-[0-9]{1,2}}/wgrane-protokoly',
            templateUrl: 'app/components/komisja-obwodowa/wgrane-protokoly/WgraneProtokolyView.html',
            controller: 'KOWgraneProtokolyController as vm'
        })
        
        .state('komisja-obwodowa-lista', {
            url: '/komisja-obwodowa/lista/{page:[0-9]*}',
            templateUrl: 'app/components/komisja-obwodowa/lista/ListaView.html',
            controller: 'KOListaController as ctrl',
            params: {
                page: {
                  value: 1,
                  squash: true
            } }
        })
        
        .state('authlogout', {
            url: '/auth/logout',
            template: '',
            controller: 'LogoutController'
        });
}