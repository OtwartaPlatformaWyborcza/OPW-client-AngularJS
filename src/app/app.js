/*global routesConfig*/
'use strict';
angular.module('app',[
	'ngRoute',
    'components',
    'shared'

	])

.config(['$routeProvider', '$locationProvider', routesConfig])

.run(['$rootScope','$location','AuthService', runConfig])

.constant('USER_ROLES', {
    admin: 'admin',
    user: 'user',
    guest: 'guest'
});