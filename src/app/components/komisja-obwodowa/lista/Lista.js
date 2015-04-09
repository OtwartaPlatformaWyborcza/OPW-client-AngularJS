/*global KOListaController*/
'use strict';
angular.module('komisja-obwodowa.lista', [])
    .controller('KOListaController', ['$stateParams', 'KomisjaObwodowaService',
        'SessionService', 'AlertsService', KOListaController
    ]);
