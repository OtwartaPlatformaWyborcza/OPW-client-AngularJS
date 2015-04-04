angular.module('controls.pagination', [])
.directive('pagination', [Pagination]);

function Pagination() {

  return {
  	restrict: 'E',
  	replace: true,
  	scope: {
	 	currentPage: '@currentpage',
	 	lastPage:'@lastpage',
	 	sName: '@sname',
	 	sParams: '@sparams', /*additional params to url*/
	 	sPageParamName: '@pageparamname' /*page param name from router state*/
	 	
	},
	templateUrl: 'app/shared/controls/pagination/PaginationView.html',
	controller: ['$state',PaginationController],
    controllerAs: 'vm',
    bindToController: true,
    
    link: function postLink(scope, iElement, iAttrs){
    	//console.log(parseInt(iAttrs.pageparamname));
       if (!iAttrs.pageparamname) {iAttrs.pageparamname = 'page'; }
       if (!iAttrs.sparams) { sparams = ''; }
       
    },
    
  };
}