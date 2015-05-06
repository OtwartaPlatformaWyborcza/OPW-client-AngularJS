(function() {
    'use strict';
    angular
        .module('shared.validators')
        .directive('lessThan', LessThan);

    ////////////////
    // Directives //
    ////////////////
    function LessThan() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                lessThan: '='
            },
            link: function(scope, element, iAttrs, ctrl) {
                ctrl.$parsers.unshift(function(value) {
                    var valid;
                    if (value) {
                        valid = parseInt(value) <= parseInt(scope.lessThan);
                        ctrl.$setValidity('lessThan', valid);
                    }
                    return value;
                });

            }
        };
    }
})();
