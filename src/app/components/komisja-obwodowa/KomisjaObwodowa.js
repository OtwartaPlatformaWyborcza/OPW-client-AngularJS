/*global KomisjaObwodowaController, KomisjaObwodowaService*/
'use strict';
angular.module('komisja-obwodowa', [])
    .controller('KomisjaObwodowaController', [
        '$stateParams',
        'KomisjaObwodowaService',
        'AlertsService', KomisjaObwodowaController
    ])
    .service('KomisjaObwodowaService', ['$http', KomisjaObwodowaService]);
