/*jshint -W084 */
(function() {
    'use strict';
    angular.module('shared.table.responsive', [])
        .directive('responsiveTable', responsiveTable)
        .service('responsiveTableService', responsiveTableService);

    ////////////////
    // Directives //
    ////////////////
    function responsiveTable(responsiveTableService) {
        return {
            restrict: 'EA',
            scope: {},
            link: function postLink(scope, element) {
                var $tableElement = element.closest('table');

                $tableElement.addClass('responsiveTable');
                responsiveTableService.addHeaderNamesToRows($tableElement);
            }
        };
    }

    //////////////
    // Services //
    //////////////
    function responsiveTableService() {
        function addHeaderNamesToRows(element) {
            var headertext = [],
                headers = element.find('th'),
                tablebody = element.find('tbody'),
                tablerows = tablebody.children('tr'),
                i, j, row, col, current;

            for (i = 0; i < headers.length; i++) {
                current = headers[i];
                headertext.push(current.textContent.replace(/\r?\n|\r/, ''));
            }
            if (tablebody && tablerows.length) {
                for (i = 0; row = tablerows[i]; i++) {
                    for (j = 0; col = row.cells[j]; j++) {
                        if (headertext[j]) {
                            col.setAttribute('data-th', headertext[j]);
                        }
                    }
                }
            }
        }

        return {
            addHeaderNamesToRows: addHeaderNamesToRows
        };
    }
})();
