(function() {
    'use strict';
    angular
        .module('shared.form.validators')
        .directive('validatorMax', validatorMax);

    ////////////////
    // Directives //
    ////////////////
    function validatorMax() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                //refresh validation on validator change
                attrs.$observe('validatorMax', function() {
                    ngModel.$validate();
                });

                //define validator
                ngModel.$validators.validatorMax = function(value) {
                    if (attrs.validatorMax && value) {
                        return parseInt(value, 10) <= parseInt(attrs.validatorMax, 10);
                    }
                    return true;
                };
            }
        };
    }
})();
