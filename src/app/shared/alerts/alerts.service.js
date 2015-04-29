(function() {
    angular.module('shared.alerts')
        .factory('AlertsService', AlertsService);
    AlertsService.$inject = ['ALERT_TYPE'];
    function AlertsService(ALERT_TYPE) {
        'use strict';
        var alerts = {};
        var service = {
            alerts: alerts,
            addAlert: addAlert,
            clearAlerts: clearAlerts,
            addError: addError,
            addSuccess: addSuccess,
            addWarning: addWarning

        };
        return service;

        function clearAlerts() {
            for (var x = 0; x < alerts.length; x++) {
                delete alerts[x];
            }
        }

        function addError(message) {
            addAlert(message, ALERT_TYPE.error);
        }

        function addSuccess(message) {
            addAlert(message, ALERT_TYPE.success);
        }

        function addWarning(message) {
            addAlert(message, ALERT_TYPE.warning);
        }

        function addAlert(message, type) {
            alerts[type] = message;
        }
    }
})();
