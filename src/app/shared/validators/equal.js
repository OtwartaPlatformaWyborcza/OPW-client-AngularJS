(function() {
    'use strict';
    angular
        .module('shared.validators')
        .directive('equal', Equal);

    ////////////////
    // Directives //
    ////////////////
    function Equal() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                equal: '='
            },
            link: function(scope, element, iAttrs, ctrl) {
                ctrl.$parsers.unshift(function(value) {
                    var valid;
                    if (value) {
                        valid = parseInt(value) === parseInt(scope.equal);
                        console.log(scope.equal);
                        ctrl.$setValidity('equal', valid);
                    }
                    return value;
                });

            }
        };
    }
})();
