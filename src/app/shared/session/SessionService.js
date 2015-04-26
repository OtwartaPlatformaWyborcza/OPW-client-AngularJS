'use strict';

function SessionService(USER_ROLES) {
    this.create = function(token, userId, userRole) {
        this.token = token;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function() {
        this.token = null;
        this.userId = null;
        this.userRole = null;
    };

    this.getUserId = function() {
        return this.userId;
    };

    this.userRole = USER_ROLES.guest;
}
