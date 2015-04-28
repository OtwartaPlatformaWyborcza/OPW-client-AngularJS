(function() {
    'use strict';
    angular
        .module('komisja-obwodowa')
        .controller('KOWgraneProtokolyController', KOWgraneProtokolyController);
    KOWgraneProtokolyController.$inject = ['$stateParams', 'KomisjaObwodowaService'];
    function KOWgraneProtokolyController($stateParams, KomisjaObwodowaService) {
        var vm = this;
    }
})();
