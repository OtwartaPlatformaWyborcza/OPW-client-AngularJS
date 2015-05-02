(function() {
    'use strict';
    angular
        .module('shared.controls.pagination')
        .directive('pagination', Pagination)
        .controller('PaginationController', PaginationController);

    function Pagination() {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                currentPage: '@currentpage',
                lastPage: '@lastpage',
                sName: '@sname',
                sParams: '@sparams',
                /*additional params to url*/
                sPageParamName: '@pageparamname' /*page param name from router state*/

            },
            templateUrl: 'app/shared/controls/pagination/pagination.view.html',
            controller: ['$state', PaginationController],
            controllerAs: 'vm',
            bindToController: true,

            link: function postLink(scope, iElement, iAttrs) {
                //console.log(parseInt(iAttrs.pageparamname));
                if (!iAttrs.pageparamname) {
                    iAttrs.pageparamname = 'page';
                }
                if (!iAttrs.sparams) {
                    iAttrs.sparams = '';
                }
            },
        };
    }

    PaginationController.$inject = ['$state'];
    function PaginationController($state) {
        var vm = this;
        vm.getPageRange = function() {
            //console.log('getPageRange');
            var items = [];
            for (var i = 1; i <= parseInt(vm.lastPage); i++) {
                items.push(i);
            }

            return items;
        };
        vm.getCurrentPage = function() {
            return parseInt(vm.currentPage);
        };
        vm.isFirstPage = function(n) {
            n = n || vm.getCurrentPage();
            return parseInt(n, 10) === 1;
        };
        vm.isLastPage = function(n) {
            n = n || vm.getCurrentPage();
            return n >= vm.lastPage;
        };

        vm.getHref = function(n) {
            var params, href;
            if (vm.sParams) {
                params = vm.sParams;
                params[vm.sPageParamName] = n;
            } else {
                params = {};
                params[vm.sPageParamName] = n;
            }

            href = $state.href(vm.sName, params);
            return href;
        };
    }
})();
