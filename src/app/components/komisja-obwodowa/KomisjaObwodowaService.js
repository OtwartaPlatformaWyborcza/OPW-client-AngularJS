'use strict';
function KomisjaObwodowaService($http){

	this.getById = function (id) {
		return $http.get('/rest-api/service/komisja/' +  id);
    };

    this.getForUser = function(userId){
    	return $http.get('/rest-api/service/user/' + userId + '/obwodowa');
    };
}