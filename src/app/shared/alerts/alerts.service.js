(function() {
    angular.module('shared.alerts')
        .factory('AlertsService', AlertsService);
    AlertsService.$inject = ['ALERT_TYPE'];
    function AlertsService(ALERT_TYPE) {
        'use strict';
        var alerts = {};
        init();
        var service = {
            clear: clear,
            addError: makeAdd(ALERT_TYPE.error),
            addSuccess: makeAdd(ALERT_TYPE.success),
            addWarning: makeAdd(ALERT_TYPE.warning),
            getErrors: makeGet(ALERT_TYPE.error),
            getSuccesses: makeGet(ALERT_TYPE.success),
            getWarnings: makeGet(ALERT_TYPE.warning),
            clearErrors: makeClear(ALERT_TYPE.error),
            clearWarnings: makeClear(ALERT_TYPE.warning),
            clearSuccesses: makeClear(ALERT_TYPE.success)
        };

        return service;

        function clear() {
            init();
        }
        function makeClear(type) {
            return function() {
                alerts[type] = [];
            };
        }
        function makeAdd(type) {
            return function (message) {
                var alert = {msg : message};
                alerts[type].push(alert);
            };
        }
        function makeGet(type) {
            return function () {
                return alerts[type];
            };
        }
        function init() {
            alerts = {};
            alerts[ALERT_TYPE.error] = [];
            alerts[ALERT_TYPE.success] = [];
            alerts[ALERT_TYPE.warning] = [];
        }
    }
})();
