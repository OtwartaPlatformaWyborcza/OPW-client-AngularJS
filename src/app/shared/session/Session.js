/*global SessionService*/
'use strict';
angular.module('session', [])
    .service('SessionService', ['USER_ROLES', SessionService]);
