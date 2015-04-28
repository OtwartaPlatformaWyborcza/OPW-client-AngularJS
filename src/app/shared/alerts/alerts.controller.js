(function() {
    'use strict';
    angular.module('shared.alerts', [])
        .controller('AlertsController', AlertsController)
        .constant('ALERT_TYPE', {
                success: 'alert-success',
                error: 'alert-danger',
                warning: 'alert-warning'});
    AlertsController.$inject = ['AlertsService'];

    function AlertsController(AlertsService) {
        var vm = this;
        vm.alerts = AlertsService.alerts;
        vm.areAlertsEmpty = areAlertsEmpty;
        function areAlertsEmpty() {
            return Object.keys(vm.alerts).length === 0;
        }
    }

})();
