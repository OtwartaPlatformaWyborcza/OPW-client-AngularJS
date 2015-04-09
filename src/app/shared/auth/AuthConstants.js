'use strict';
angular.module('auth.constants', [])
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    }).constant('AUTH', {
        TOKEN_HEADER_NAME: 'X-OPW-token',
        LOGIN_HEADER_NAME: 'X-OPW-login',
        PASSWORD_HEADER_NAME: 'X-OPW-password'
    });
