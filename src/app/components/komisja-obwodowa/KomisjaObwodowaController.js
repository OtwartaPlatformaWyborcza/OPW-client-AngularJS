'use strict';
function KomisjaObwodowaController($stateParams,KomisjaObwodowaService,AlertsService) {

	var viewModel = this;

    KomisjaObwodowaService.getById($stateParams.id).then(function(response) {
        console.log(response);
        viewModel.data = JSON.stringify(response.data);
    }, function(response) {
        AlertsService.addError('Nie udało się pobrać danych komisji. (status: ' + response.status + ' ' + response.statusText + ')');
    });
}