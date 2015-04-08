'use strict';
function KomisjaObwodowaController($stateParams,KomisjaObwodowaService,AlertsService) {

	var vm = this;

	vm.labels = ['I.1 Uprawnionych do głosowania',
					'I.4 Wydano kart do głosowania',
					'II.11 Kart ważnych',
					'II.12 Głosów nieważnych'];


 	vm.numbers = [];
    KomisjaObwodowaService.getById($stateParams.id).then(function(response) {
        console.log(response.data);
        vm.data = JSON.stringify(response.data);
        vm.komisja = response.data;

       
    }, function(response) {
        AlertsService.addError('Nie udało się pobrać danych komisji. (status: ' + response.status + ' ' + response.statusText + ')');
    });


    vm.submit = function(isValid){
    	vm.submitted = true;
        console.log(vm.form.subform);
    	console.log(vm.form.subform);

    	if (vm.form.$valid) {
      // Submit as normal
    } else {
      vm.form.submitted = true;
    }
    };
}