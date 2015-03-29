/*global app */
'use strict';
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
 
    
    .when('/auth/login', {
            templateUrl: 'app/components/auth/loginView.html',
            controller: 'LoginController'
    })
    .when('/komisja-obwodowa/id/:id', {
            templateUrl: 'app/components/komisja-obwodowa/komisjaObwodowaView.html',
            controller: 'KomisjaObwodowaController'
    })
    .when('/komisja-obwodowa/lista', {
            templateUrl: 'app/components/komisja-obwodowa/komisjaObwodowaListView.html',
            controller: 'KomisjaObwodowaListController'
    })
    
    .when('/auth/logout', {
            templateUrl: 'app/components/auth/LogoutView.html',
            controller: 'LogoutController'
    })
    .otherwise({
            redirectTo: '/auth/login'
    });


    $locationProvider.html5Mode(true);

}]).run(['$rootScope','$location','AuthService', function($rootScope,$location,AuthService) {
        $rootScope.$on('$routeChangeStart', function(event, next, current) {

            if(!AuthService.isUserAuthenticated() && $location.path() !== '/auth/login'){
                console.log('User not authorized, redirect to login page');
                $location.path('/auth/login');
            } else if (true) {
                //sprawdzic czy rola uzytkownika jest w next.authorizedRoles
                
            }

        });
}]);
