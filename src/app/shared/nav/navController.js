/*global app */
'use strict';
app.controller('NavController', ['$scope', '$location', 'authService', function($scope,$location,authService) {
   
    $scope.pages = [
      {href: '/users', title: 'Users'},
      {href: '/test', title: 'Test'},
    ];

   $scope.isPageActive = function(page){
    	return page.href === $location.path()
   };

    clickOnNavItem = function(){
    	$('ul.nav li').removeClass('active'); 
    	$(this).parent().addClass('active');
    }
    $(document).on('click','ul.nav li a',clickOnNavItem);

    $scope.isUserAuthenticated = function (){
    	//console.log('authServiceInstance::isUserAuthenticated');
    	return authService.isUserAuthenticated();
    }

}]);