(function() {
    'use strict';
    angular.module('shared.table', [])
        .directive('responsiveTable', responsiveTable);

    ////////////////
    // Directives //
    ////////////////
    function responsiveTable() {
        return {
            restrict: 'EA',
            scope: {},
            link: function postLink(scope, element) {
                element.addClass('responsiveTable');

                element.each(function() {
                    var headertext = [],
                        headers = this.querySelectorAll('th'),
                        tablebody = this.querySelector('tbody'),
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
                });
            }
        };
    }
})();
