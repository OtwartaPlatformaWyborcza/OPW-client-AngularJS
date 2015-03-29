/*global app */
'use strict';
app.controller('KomisjaObwodowaController', function($scope, $http, $routeParams,AlertsService) {
     $http.get('/rest-api/service/komisja/' +  $routeParams.id).then(function(response) {
        console.log(response.data);
        $scope.data = JSON.stringify(response.data);
    }, function(response) {
        AlertsService.addError('Nie udało się pobrać danych komisji. (status: ' + response.status + ' ' + response.statusText + ')');
    });
});

