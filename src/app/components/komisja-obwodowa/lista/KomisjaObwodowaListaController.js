/*global app*/
'use strict';
function KomisjaObwodowaListaController(KomisjaObwodowaService,SessionService, AlertsService) {
    console.log("komisja obwodowa lista");
    var viewModel = this;

    KomisjaObwodowaService.getForUser(SessionService.getUserId()).then(function(response) {
        viewModel.items = response.data;
    }, function(response) {
        AlertsService.addError('Nie udało się pobrać listy komisji. (status: ' + response.status + ' ' + response.statusText + ')');
    });
}
