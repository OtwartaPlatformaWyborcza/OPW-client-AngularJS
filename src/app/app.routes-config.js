'use strict';
function routesConfig($routeProvider, $locationProvider) {
    $routeProvider
 
    
    .when('/auth/login', {
            templateUrl: 'app/components/auth/login/LoginView.html',
            controller: 'LoginController'
    })
    .when('/komisja-obwodowa/id/:id', {
            templateUrl: 'app/components/komisja-obwodowa/KomisjaObwodowaView.html',
            controller: 'KomisjaObwodowaController as ctrl'
    })
    .when('/komisja-obwodowa/lista', {
            templateUrl: 'app/components/komisja-obwodowa/lista/KomisjaObwodowaListaView.html',
            controller: 'KomisjaObwodowaListaController as ctrl'
    })
    
    .when('/auth/logout', {
            template: '',
            controller: 'LogoutController'
    })
    .otherwise({
            redirectTo: '/auth/login'
    });


    $locationProvider.html5Mode(true);
}