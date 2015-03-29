/*global app*/
'use strict';
app.controller('LoginController', ['$scope', '$location', 'AuthService', 'AlertsService', function($scope, $location, AuthService, AlertsService) {

    if (AuthService.isUserAuthenticated()) {
        $location.path('/komisja-obwodowa/lista');
    }

    $scope.credentials = {};
    $scope.login = function() {

        AuthService.login($scope.credentials)
            .then(
                function(response) {
                    if (response.status === 200) {

                        $location.path('/komisja-obwodowa/lista');
                    } else {
                        AlertsService.addError('Błędne dane logowania');
                    }

                },
                function() {
                    AlertsService.addError('Błędne dane logowania');
                });

    };
}]);
