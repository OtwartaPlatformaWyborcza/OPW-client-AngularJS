/*jshint -W084 */
(function() {
    'use strict';
    angular.module('shared.table', [])
        .directive('responsiveTable', ['tableService', responsiveTable])
        .service('tableService', tableService);

    ////////////////
    // Directives //
    ////////////////
    function responsiveTable(tableService) {
        return {
            restrict: 'EA',
            scope: {},
            link: function postLink(scope, element) {
                var $tableElement = element.closest('table');

                $tableElement.addClass('responsiveTable');
                tableService.addHeadersToRows($tableElement[0]);
            }
        };
    }

    //////////////
    // Services //
    //////////////
    function tableService() {
        function addHeadersToRows(element) {
            var headertext = [],
                headers = element.querySelectorAll('th'),
                tablebody = element.querySelector('tbody'),
                i, j, row, col, current;

            for (i = 0; i < headers.length; i++) {
                current = headers[i];
                headertext.push(current.textContent.replace(/\r?\n|\r/, ''));
            }
            if (tablebody && tablebody.rows && tablebody.rows.length) {
                for (i = 0; row = tablebody.rows[i]; i++) {
                    for (j = 0; col = row.cells[j]; j++) {
                        if (headertext[j]) {
                            col.setAttribute('data-th', headertext[j]);
                        }
                    }
                }
            }
        }

        return {
            addHeadersToRows: addHeadersToRows
        };
    }
})();
