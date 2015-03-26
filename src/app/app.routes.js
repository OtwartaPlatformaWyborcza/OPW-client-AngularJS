/*global app */
'use strict';
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
 
        .when('/', {
        templateUrl: 'app/components/test/testView.html',
        controller: 'TestController'
    })
    .when('/login', {
            templateUrl: 'app/components/login/loginView.html',
            controller: 'LoginController'
    }).otherwise({
            redirectTo: '/users'
    });


    $locationProvider.html5Mode(true);

}]).run(['$rootScope','$location','authService', function($rootScope,$location,authService) {
        $rootScope.$on('$routeChangeStart', function(event, next, current) {

            if(!authService.isUserAuthenticated() && $location.path() !== '/login'){
                console.log('User not authorized, redirect to login page');
                $location.path('/login');
            } else if (true) {
                //sprawdzic czy rola uzytkownika jest w next.authorizedRoles
                console.log(next.authorizedRoles);
                console.log('route change2');
            }

        });
}]);
