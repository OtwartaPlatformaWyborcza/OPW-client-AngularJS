/*global app */
'use strict';
app.service('authService',['$http', function($http) {
  console.log('init auth service')
  var authenticated = false;
  this.isUserAuthenticated = function (){
  	return authenticated;
  }


  this.login = function(credentials){
  		
       var config = {headers: {
            'login': 'admin',
            'password': 'admin'
        }
      };

      $http.get('/rest-api/service/user/login', config)

  		.success(function(data){
  			console.log("success");
  				console.log(data);
  		})
		.error(
			function(){console.log(data);}
		);
  }
}]);