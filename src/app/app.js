/*global routesConfig, runConfig*/
'use strict';
angular.module('app',[
	'ui.router',
    'components',
    'shared'

	])

.config(['$stateProvider', '$urlRouterProvider','$locationProvider','USER_ROLES', routesConfig])

.run(['$rootScope','$location','AuthService', runConfig])

.constant('USER_ROLES', {
    admin: 'admin',
    user: 'user',
    guest: 'guest'
});