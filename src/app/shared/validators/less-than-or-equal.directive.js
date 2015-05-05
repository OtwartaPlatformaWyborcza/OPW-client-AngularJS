(function() {
    'use strict';
    angular
        .module('shared.validators', [])
        .directive('lessThanOrEqual', LessThanOrEqual);

    function LessThanOrEqual() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                lessThanOrEqual: '='
            },
            link: function(scope, element, iAttrs, ctrl) {
                ctrl.$parsers.unshift(function(value) {
                    var valid;
                    if (value) {
                        valid = parseInt(value) <= parseInt(scope.lessThanOrEqual);
                        console.log(parseInt(value) + '>='  + parseInt(scope.lessThanOrEqual) +
                             ' = ' + (parseInt(value) <= parseInt(scope.lessThanOrEqual)));
                        ctrl.$setValidity('lessThanOrEqual', valid);
                    }
                    return value;
                });

            }
        };
    }
})();
