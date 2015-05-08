(function() {
    'use strict';
    angular.module('shared.form', [
        'shared.form.errorBox',
        'shared.form.validators'
    ])
    .directive('ignoreMouseWheel', ignoreMouseWheel);

    ////////////////
    // Directives //
    ////////////////
    function ignoreMouseWheel() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.bind('mousewheel', function () {
                    if (element[0] === document.activeElement) {
                        element.blur();
                    }
                });
            }
        };
    }
})();
