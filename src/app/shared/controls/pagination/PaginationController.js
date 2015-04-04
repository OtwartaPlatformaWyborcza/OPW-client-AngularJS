'use strict';
 function PaginationController($state){
	var vm = this;

	vm.getPageRange = function(){
		//console.log('getPageRange');
		var items = [];
		for (var i = 1; i <= parseInt(vm.lastPage); i++) {
    			items.push(i);	
		};

		return items;
	}

	var callCounter =0;
	vm.getHref = function(n){
		var params,href;
		if (vm.sParams){
			params = eval('(' + vm.sParams + ')');
			params[vm.sPageParamName] = n;
		} else {
			params = {};
			params[vm.sPageParamName] = n;
		}
		
		href =  $state.href('komisja-obwodowa-lista',params);
		//console.log(++callCounter + " n:" + n + " last page:" + vm.lastPage + " href: " +href);
		return href;
	}
}