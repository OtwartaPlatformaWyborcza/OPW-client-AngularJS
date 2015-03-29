/*global app*/
'use strict';
app.controller('KomisjaObwodowaListController', function($scope, $http, SessionService, AlertsService) {
    $http.get('/rest-api/service/user/' + SessionService.getUserId() + '/obwodowa').then(function(response) {
        
    	console.log(response.data);
        $scope.items = response.data;
    }, function(response) {
        AlertsService.addError('Nie udało się pobrać listy komisji. (status: ' + response.status + ' ' + response.statusText + ')');
    });
});
