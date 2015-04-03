angular.module('alerts',['alerts.constants'])
.controller('AlertsController',['$scope','AlertsService',AlertsController])
.factory('AlertsService',['ALERT_TYPE',AlertsService]); 