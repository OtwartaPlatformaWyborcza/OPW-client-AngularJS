'use strict';
function KOListaController($stateParams,KomisjaObwodowaService,SessionService, AlertsService) {
 
    var viewModel = this,
	currentPage = parseInt($stateParams.page),
	lastPage,
    itemsPerPage = 6,
    visibleFrom=0,
    visibleTo =10,
    items;
   

    KomisjaObwodowaService.getForUser(SessionService.getUserId()).then(function(response) {
        items = response.data;
        visibleFrom = Math.floor(itemsPerPage * (currentPage - 1));
        visibleTo = visibleFrom + itemsPerPage;
        lastPage = Math.ceil(items.length / itemsPerPage);

        viewModel.items = items;
        viewModel.visibleFrom = visibleFrom;
    	viewModel.visibleTo = visibleTo;
    	viewModel.itemsPerPage = itemsPerPage;
    	viewModel.currentPage = currentPage;
    	viewModel.lastPage = lastPage;

    

    }, function(response) {
        AlertsService.addError('Nie udało się pobrać listy komisji. (status: ' + response.status + ' ' + response.statusText + ')');
    });

}
