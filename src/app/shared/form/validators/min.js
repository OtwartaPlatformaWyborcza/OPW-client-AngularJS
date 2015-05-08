(function() {
    'use strict';
    angular
        .module('shared.form.validators')
        .directive('validatorMin', validatorMin);

    ////////////////
    // Directives //
    ////////////////
    function validatorMin() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                //define validator
                ngModel.$validators.validatorMin = function(value) {
                    //refresh validation on validator change
                    attrs.$observe('validatorMin', function() {
                        ngModel.$validate();
                    });

                    //define validator
                    if (attrs.validatorMin && value) {
                        return parseInt(value, 10) >= parseInt(attrs.validatorMin, 10);
                    }
                    return true;
                };
            }
        };
    }
})();
