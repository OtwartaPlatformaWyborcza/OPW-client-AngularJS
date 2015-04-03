/*global KomisjaObwodowaController, KomisjaObwodowaService*/
'use strict';
angular.module('komisja-obwodowa',[])
.controller('KomisjaObwodowaController',[
					'$routeParams',
					'KomisjaObwodowaService',
					'AlertsService',KomisjaObwodowaController])
.service('KomisjaObwodowaService',
				['$http',KomisjaObwodowaService]);
