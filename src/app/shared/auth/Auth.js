angular.module('auth',[
    'auth.constants',
    'session'])

.service('AuthService', ['$http', '$q', '$location', 'SessionService', 'USER_ROLES', AuthService])

.factory('AuthInterceptor',['$rootScope','$q', '$location', 'AUTH','AUTH_EVENTS',AuthInterceptor])

.config(['$httpProvider', function($httpProvider) {$httpProvider.interceptors.push('AuthInterceptor');}])

.run(['$rootScope', 'AUTH_EVENTS', 'AuthService',function($rootScope, AUTH_EVENTS, AuthService) {
    
    if (!AuthService.isUserAuthenticated()){
            AuthService.init();
    }

    $rootScope.$on('$stateChangeStart', function(event, next) {
        var authorizedRoles = next.authorizedRoles;
        
        if (!AuthService.isUserAuthorized(authorizedRoles)) {
            //event.preventDefault();
            if (AuthService.isUserAuthenticated()) {
                // user is not allowed
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            } else {
                // user is not logged in
                console.log("user notAuthenticated")
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }
    });
}]);