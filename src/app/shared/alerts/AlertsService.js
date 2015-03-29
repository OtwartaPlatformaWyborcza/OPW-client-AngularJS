/*global app */
'use strict';
app.factory('AlertsService', function(ALERT_TYPE) {
    return {
        alerts: {},
        addAlert: function(message, type) {
            this.alerts[type] = this.alerts[type] || [];
            this.alerts[type].push(message);
        },
        clearAlerts: function() {
            for (var x in this.alerts) {
                delete this.alerts[x];
            }
        },
        addError:function(message){
        	this.addAlert(message,ALERT_TYPE.error);
        },
        addSuccess:function(message){
        	addAlert(message,ALERT_TYPE.success);
        },
        addWarning:function(message){
        	addAlert(message,ALERT_TYPE.warning);
        }
    };
});
