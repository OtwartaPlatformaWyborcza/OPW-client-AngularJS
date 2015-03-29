/*global app */
'use strict';
app.controller('AlertsController', function($scope,AlertsService) {
    $scope.alerts = AlertsService.alerts;
    
    $scope.areAlertsEmpty = function(){
    	return Object.keys($scope.alerts).length == 0;
    }
});

