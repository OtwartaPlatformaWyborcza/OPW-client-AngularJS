'use strict';
function AlertsController($scope,AlertsService) {
    $scope.alerts = AlertsService.alerts;
    
    $scope.areAlertsEmpty = function(){
    	return Object.keys($scope.alerts).length == 0;
    }
}

