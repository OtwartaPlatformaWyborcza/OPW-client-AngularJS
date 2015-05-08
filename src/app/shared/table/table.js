(function() {
    'use strict';
    angular.module('shared.table', [
        'smart-table',
        'shared.table.responsive'
    ])

    ////////////
    // Config //
    ////////////
    .config(function(stConfig) {
        stConfig.pagination.template = 'app/shared/table/table-pagination.tpl.html';
    })

    ////////////////
    // Directives //
    ////////////////
    .directive('pageSelect', function() {
        return {
            restrict: 'E',
            template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
            link: function(scope) {
                scope.$watch('currentPage', function(c) {
                    scope.inputPage = c;
                });
            }
        };
    })

    /////////////
    // Filters //
    /////////////
    .filter('commonTableFormat', function() {
        return function(item) {
            if (angular.isNumber(parseInt(item, 10))) {
                return parseInt(item, 10);
            }
            else {
                return item;
            }
        };
    });

})();
