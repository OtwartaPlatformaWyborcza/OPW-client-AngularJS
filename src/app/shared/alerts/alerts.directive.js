(function() {
    angular
    .module('shared.alerts', [])
    .directive('opwAlerts', opwAlerts)
    .controller('OpwAlertsController', OpwAlertsController);

    function opwAlerts() {
        return {
            restrict: 'E',
            scope:{},
            templateUrl: 'app/shared/alerts/alerts.view.html',
            controller: ['AlertsService', '$interval', OpwAlertsController],
            controllerAs: 'vm',
            bindToController: true
        };
    }

    OpwAlertsController.$inject = ['AlertsService', '$interval'];
    function OpwAlertsController(AlertsService, $interval) {
        var vm = this;
        vm.errors = AlertsService.getErrors();
        vm.successes = AlertsService.getSuccesses();
        vm.warnings = AlertsService.getWarnings();
        vm.areAlertsEmpty = areAlertsEmpty;
        vm.closeErrors = clearErrors;
        vm.closeSuccesses = clearSuccesses;
        vm.closeWarnings = clearWarnings;
        function areAlertsEmpty() {
            vm.errors = AlertsService.getErrors();
            vm.successes = AlertsService.getSuccesses();
            vm.warnings = AlertsService.getWarnings();
            return Object.keys(vm.errors).length === 0 &&
                    Object.keys(vm.successes).length === 0 &&
                    Object.keys(vm.warnings).length === 0;
        }
        function clearErrors() {
            AlertsService.clearErrors();
            vm.errors = AlertsService.getErrors();
        }
        function clearWarnings() {
            AlertsService.clearWarnings();
            vm.errors = AlertsService.getWarnings();
        }
        function clearSuccesses() {
            AlertsService.clearSuccesses();
            vm.errors = AlertsService.getSuccesses();
        }
        $interval(AlertsService.clear, 5000);
    }
})();
