(function() {
    'use strict';
    angular
        .module('shared.form.validators')
        .directive('validatorEqual', validatorEqual)
        .directive('validatorEqualEntered', validatorEqualEntered);

    ////////////////
    // Directives //
    ////////////////
    function validatorEqual() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                //refresh validation on validator change
                attrs.$observe('validatorEqual', function() {
                    ngModel.$validate();
                });

                //define validator
                ngModel.$validators.validatorEqual = function(value) {
                    //define validator
                    if (attrs.validatorEqual && value) {
                        return parseInt(value) === parseInt(attrs.validatorEqual, 10);
                    }
                    return true;
                };
            }
        };
    }
    function validatorEqualEntered() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                //define validator
                ngModel.$validators.validatorEqualEntered = function() {
                    var validatorEqual = parseInt(attrs.validatorEqual, 10);
                    //define validator
                    return (attrs.validatorEqual && !isNaN(validatorEqual));
                };
            }
        };
    }
})();
