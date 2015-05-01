(function() {
    'use strict';
    angular.module('shared.alerts')
        .constant('ALERT_TYPE', {
            success: 'alert-success',
            error: 'alert-danger',
            warning: 'alert-warning'
        });
})();
