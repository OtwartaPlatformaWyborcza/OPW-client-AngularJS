/*jshint -W084 */
(function() {
    'use strict';
    angular.module('shared.utilities', [])
        .filter('num', num);

    ////////////////
    // Directives //
    ////////////////
    function num() {
        return function(input) {
            return parseInt(input, 10);
        };
    }
})();
