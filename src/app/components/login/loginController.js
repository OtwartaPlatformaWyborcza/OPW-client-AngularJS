/*global app*/
'use strict';
app.controller('LoginController', function($scope,authService) {


	$scope.credentials = {};
	$scope.login = function() {
		console.log($scope.credentials);

		authService.login($scope.credentials);
	};
});