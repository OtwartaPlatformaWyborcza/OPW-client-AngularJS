(function() {
    'use strict';
    angular
        .module('shared.validators')
        .directive('greaterThanOrEqual', GreaterThanOrEqual);

    ////////////////
    // Directives //
    ////////////////
    function GreaterThanOrEqual() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                greaterThanOrEqual: '='
            },
            link: function(scope, element, iAttrs, ctrl) {
                ctrl.$parsers.unshift(function(value) {
                    var valid;
                    if (value) {
                        valid = parseInt(value) >= parseInt(scope.greaterThanOrEqual);
                        console.log(parseInt(value) + '>='  + parseInt(scope.greaterThanOrEqual) +
                             ' = ' + (parseInt(value) >= parseInt(scope.greaterThanOrEqual)));
                        ctrl.$setValidity('greaterThanOrEqual', valid);
                    }
                    return value;
                });

            }
        };
    }
})();
