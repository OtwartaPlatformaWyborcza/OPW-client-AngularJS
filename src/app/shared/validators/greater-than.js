(function() {
    'use strict';
    angular
        .module('shared.validators')
        .directive('greaterThan', GreaterThan);

    ////////////////
    // Directives //
    ////////////////
    function GreaterThan() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                greaterThan: '='
            },
            link: function(scope, element, iAttrs, ctrl) {
                ctrl.$parsers.unshift(function(value) {
                    var valid;
                    if (value) {
                        valid = parseInt(value) >= parseInt(scope.greaterThan);
                        ctrl.$setValidity('greaterThan', valid);
                    }
                    return value;
                });

            }
        };
    }
})();
