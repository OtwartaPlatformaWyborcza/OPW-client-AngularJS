angular.module('shared.form.errorBox', [])

.directive('errorBox', function errorBox() {
    'use strict';

    return {
        restrict: 'EA',
        templateUrl: 'app/shared/form/errorBox/errorBox.tpl.html',
        transclude: true,
        replace: true
    };
})

;
