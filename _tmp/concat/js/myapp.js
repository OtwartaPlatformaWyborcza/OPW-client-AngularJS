(function() {
    'use strict';
    angular
        .module('app', ['ui.router',
                        'shared.auth',
                        'shared.alerts',
                        'shared.controls.pagination',
                        'shared.session',
                        'shared.validators',
                        'shared.table',
                        'auth',
                        'komisja-obwodowa'])
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'USER_ROLES', routesConfig])
        .run(['$rootScope', '$location', 'AuthService', runConfig])
        .constant('USER_ROLES', {
            admin: 'admin',
            user: 'user',
            guest: 'guest'
        });


    ////////////
    // Config //
    ////////////
    function routesConfig($stateProvider, $urlRouterProvider, $locationProvider, USER_ROLES) {

        $urlRouterProvider.otherwise('/auth/login');
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('authlogin', {
                url: '/auth/login',
                templateUrl: 'app/components/auth/login/login.view.html',
                controller: 'LoginController as vm',
                authorizedRoles: [USER_ROLES.guest]
            })
            .state('komisja-obwodowa', {
                url: '/komisja-obwodowa/{id:[0-9]{4,8}-[0-9]{1,3}}',
                templateUrl: 'app/components/komisja-obwodowa/komisja-obwodowa.view.html',
                controller: 'KomisjaObwodowaController as vm'
            })
            .state('komisja-obwodowa-protokoly', {
                url: '/komisja-obwodowa/{id:[0-9]{4,8}-[0-9]{1,3}}/wgrane-protokoly/{page:[0-9]*}',
                templateUrl: 'app/components/komisja-obwodowa/' +
                'wgrane-protokoly/wgrane-protokoly.view.html',
                controller: 'KOWgraneProtokolyController as vm',
                params: {
                    page: {
                        value: '1',
                        squash: true
                    }
                }
            })
            .state('komisja-obwodowa-lista', {
                url: '/komisja-obwodowa/lista/{page:[0-9]*}',
                templateUrl: 'app/components/komisja-obwodowa/lista/lista.view.html',
                controller: 'KOListaController as vm',
                params: {
                    page: {
                        value: '1',
                        squash: true
                    }
                }
            })
            .state('authlogout', {
                url: '/auth/logout',
                template: '',
                controller: 'LogoutController'
            })
            .state('komisja-obwodowa-protokol', {
                url: '/komisja-obwodowa/{commisionId:[0-9]{4,8}-[0-9]{1,3}}' +
                '/protokol/{protocolId:[0-9]*}',
                templateUrl: 'app/components/komisja-obwodowa/protokol/protokol.view.html',
                controller: 'KOProtokolController as vm'
            });
    }

    /////////
    // Run //
    /////////
    function runConfig($rootScope, $location, AuthService) {
        $rootScope.$on('$routeChangeStart',
            function(event, next, current) {
                if (!AuthService.isUserAuthenticated() && $location.path() !== '/auth/login') {
                    console.log('User not authorized, redirect to login page');
                    $location.path('/auth/login');
                }
            }
        );
    }
})();

(function() {
    'use strict';
    angular.module('shared.auth', [])
        .factory('authInterceptor', authInterceptor)
        .config(addAuthInterceptor)
        .run(authModuleRun);

    authModuleRun.$inject = ['$rootScope', 'AUTH_EVENTS', 'AuthService', '$location'];
    addAuthInterceptor.$inject = ['$httpProvider'];
    authInterceptor.$inject = ['$q', '$rootScope', '$location', 'AUTH', 'SessionService',
                            'AUTH_EVENTS'];

    function authModuleRun($rootScope, AUTH_EVENTS, AuthService, $location) {

        if (!AuthService.isUserAuthenticated()) {
            //AuthService.logout();
            //$location.path('/auth/login');
            AuthService.init();
            $location.path($location.path());
        }

        $rootScope.$on('$stateChangeStart', function(event, next) {
            var authorizedRoles = next.authorizedRoles;

            if (!AuthService.isUserAuthorized(authorizedRoles)) {
                //event.preventDefault();
                if (AuthService.isUserAuthenticated()) {
                    // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    console.log('user notAuthenticated');
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
        });
    }

    function addAuthInterceptor($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }

    function authInterceptor($q, $rootScope, $location, AUTH,
         SessionService, AUTH_EVENTS) {
        return {
            request: function(config) {
                //console.log('send token: ' + localStorage.token)
                config.headers[AUTH.TOKEN_HEADER_NAME] = SessionService.getUserToken();
                //no override if it has been set in other components (for example login action)
                if (!config.headers[AUTH.LOGIN_HEADER_NAME]) {
                    config.headers[AUTH.LOGIN_HEADER_NAME] = SessionService.getUserLogin();
                }

                return config;
            },

            responseError: function(response) {
                console.log(response.status);
                if (parseInt(response.status, 10) ===  401) {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, response.status);
                }
                //AuthService.logout();
                return $q.reject(response);
                //return $q.reject(response);
            }
        };
    }
})();

(function() {
    'use strict';
    angular.module('shared.auth')
            .service('AuthService', AuthService);
    AuthService.$inject = ['$http', '$q', '$location', 'SessionService', 'USER_ROLES'];
    function AuthService($http, $q, $location, SessionService, USER_ROLES) {
        var authenticated = false;
        var service = {
            isUserAuthenticated: isUserAuthenticated,
            login: login,
            logout: logout,
            isUserAuthorized: isUserAuthorized,
            init: init
        };
        return service;
        function isUserAuthenticated() {
            return authenticated;
        }
        function  login(credentials) {
            var config = {
                headers: {
                    'X-OPW-login': credentials.login,
                    'X-OPW-password': credentials.password
                }
            };

            return $http.get('/rest-api/service/user/login', config).success(function(data) {
                if (data.sessionActive) {
                    SessionService.create(data.token, data.id, USER_ROLES.guest, data.login);
                    authenticated = true;
                } else {
                    authenticated = false;
                }
            }).error(function() {
                authenticated = false;
            });
        }

        function logout() {
            authenticated = false;
            var deferred = $q.defer();
            $http.get('/rest-api/service/user/logout').then(
                function(response) {
                    SessionService.destroy();
                    deferred.resolve(response);
                    $location.path('/auth/login');
                },
                function () {
                    $location.path('/auth/login');
                });
            return deferred.promise;
        }

        function isUserAuthorized(authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (isUserAuthenticated() &&
                authorizedRoles.indexOf(SessionService.userRole) !== -1);
        }

        function init() {
            if (localStorage.token && localStorage.userId) {
                authenticated = true;
            }
        }
    }
})();

(function() {
    'use strict';
    angular.module('shared.auth')
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        })
        .constant('AUTH', {
            TOKEN_HEADER_NAME: 'X-OPW-token',
            LOGIN_HEADER_NAME: 'X-OPW-login',
            PASSWORD_HEADER_NAME: 'X-OPW-password'
        });
})();

(function() {
    'use strict';
    angular.module('shared.session', []);
})();

(function() {
    'use strict';
    angular
        .module('shared.session')
        .service('SessionService', SessionService);
    SessionService.$inject = ['USER_ROLES'];

    function SessionService(USER_ROLES) {
        var token, userId, userRole, userLogin;
        var service = {
            create:create,
            destroy:destroy,
            getUserId:getUserId,
            getUserToken:getUserToken,
            getUserLogin:getUserLogin
        };
        init();
        return service;

        function create(parToken, parUserId, parUserRole, parUserLogin) {
            token = parToken;
            userId = parUserId;
            userRole = parUserRole;
            userLogin = parUserLogin;

            localStorage.token = token;
            localStorage.userId = userId;
            localStorage.userRole = userRole;
            localStorage.userLogin = userLogin;
        }
        function  destroy() {
            token = null;
            userId = null;
            userRole = null;
            userLogin = null;
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userLogin');
        }
        function getUserId() {
            if (localStorage.userId) {
                return localStorage.userId;
            }
            return userId;
        }
        function getUserToken() {
            if (localStorage.token) {
                return localStorage.token;
            }
            return token;
        }
        function getUserLogin() {
            if (localStorage.userLogin) {
                return localStorage.userLogin;
            }
            return userLogin;
        }
        function init() {
            userRole = USER_ROLES.guest;
            if (localStorage.token) {
                token = localStorage.token;
            }
            if (localStorage.userId) {
                userId = localStorage.userId;
            }
            if (localStorage.userRole) {
                userRole = localStorage.userRole;
            }
            if (localStorage.userLogin) {
                userLogin = localStorage.userLogin;
            }
        }

    }
})();

(function() {
    'use strict';
    angular
        .module('shared.validators', [])
        .directive('lessThanOrEqual', LessThanOrEqual);

    function LessThanOrEqual() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                lessThanOrEqual: '='
            },
            link: function(scope, element, iAttrs, ctrl) {
                ctrl.$parsers.unshift(function(value) {
                    var valid;
                    if (value) {
                        valid = parseInt(value) <= parseInt(scope.lessThanOrEqual);
                        console.log(parseInt(value) + '>='  + parseInt(scope.lessThanOrEqual) +
                             ' = ' + (parseInt(value) <= parseInt(scope.lessThanOrEqual)));
                        ctrl.$setValidity('lessThanOrEqual', valid);
                    }
                    return value;
                });

            }
        };
    }
})();

(function() {
    'use strict';
    angular
        .module('shared.validators')
        .directive('greaterThanOrEqual', GreaterThanOrEqual);

    function GreaterThanOrEqual() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                greaterThanOrEqual: '='
            },
            link: function(scope, element, iAttrs, ctrl) {
                ctrl.$parsers.unshift(function(value) {
                    var valid;
                    if (value) {
                        valid = parseInt(value) >= parseInt(scope.greaterThanOrEqual);
                        console.log(parseInt(value) + '>='  + parseInt(scope.greaterThanOrEqual) +
                             ' = ' + (parseInt(value) >= parseInt(scope.greaterThanOrEqual)));
                        ctrl.$setValidity('greaterThanOrEqual', valid);
                    }
                    return value;
                });

            }
        };
    }
})();

(function() {
    'use strict';
    angular
        .module('shared.validators')
        .directive('equal', Equal);

    function Equal() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                equal: '='
            },
            link: function(scope, element, iAttrs, ctrl) {
                ctrl.$parsers.unshift(function(value) {
                    var valid;
                    if (value) {
                        valid = parseInt(value) === parseInt(scope.equal);
                        console.log(scope.equal);
                        ctrl.$setValidity('equal', valid);
                    }
                    return value;
                });

            }
        };
    }
})();

(function() {
    'use strict';
    angular.module('app')
        .controller('ApplicationController', ApplicationController);
    ApplicationController.$inject = ['$rootScope', 'USER_ROLES',
            'AuthService', 'AlertsService', 'AUTH_EVENTS'];

    function ApplicationController($rootScope, USER_ROLES,
            AuthService, AlertsService, AUTH_EVENTS) {
        var vm = this;
        vm.currentUser = null;
        vm.userRoles = USER_ROLES;
        vm.isAuthorized = AuthService.isAuthorized;
        vm.setCurrentUser = setCurrentUser;
        vm.isUserAuthenticated = isUserAuthenticated;
        $rootScope.$on(AUTH_EVENTS.notAuthorized,
                function(event, responseCode) {
                    if (AuthService.isUserAuthenticated()) {
                        AlertsService.addError('Zaloguj się ponownie.');
                        AuthService.logout();
                    }
                });
        function setCurrentUser(user) {
            vm.currentUser = user;
        }
        function isUserAuthenticated() {
            return AuthService.isUserAuthenticated();
        }
    }
})();

(function() {
    angular
    .module('shared.alerts', [])
    .directive('opwAlerts', opwAlerts)
    .controller('OpwAlertsController', OpwAlertsController);

    function opwAlerts() {
        return {
            restrict: 'E',
            scope:{},
            templateUrl: 'app/shared/alerts/alerts.view.html',
            controller: ['AlertsService', '$interval', OpwAlertsController],
            controllerAs: 'vm',
            bindToController: true
        };
    }

    OpwAlertsController.$inject = ['AlertsService', '$interval'];
    function OpwAlertsController(AlertsService, $interval) {
        var vm = this;
        vm.errors = AlertsService.getErrors();
        vm.successes = AlertsService.getSuccesses();
        vm.warnings = AlertsService.getWarnings();
        vm.areAlertsEmpty = areAlertsEmpty;
        vm.closeErrors = clearErrors;
        vm.closeSuccesses = clearSuccesses;
        vm.closeWarnings = clearWarnings;
        function areAlertsEmpty() {
            vm.errors = AlertsService.getErrors();
            vm.successes = AlertsService.getSuccesses();
            vm.warnings = AlertsService.getWarnings();
            return Object.keys(vm.errors).length === 0 &&
                    Object.keys(vm.successes).length === 0 &&
                    Object.keys(vm.warnings).length === 0;
        }
        function clearErrors() {
            AlertsService.clearErrors();
            vm.errors = AlertsService.getErrors();
        }
        function clearWarnings() {
            AlertsService.clearWarnings();
            vm.errors = AlertsService.getWarnings();
        }
        function clearSuccesses() {
            AlertsService.clearSuccesses();
            vm.errors = AlertsService.getSuccesses();
        }
        $interval(AlertsService.clear, 5000);
    }
})();

(function() {
    angular.module('shared.alerts')
        .factory('AlertsService', AlertsService);
    AlertsService.$inject = ['ALERT_TYPE'];
    function AlertsService(ALERT_TYPE) {
        'use strict';
        var alerts = {};
        init();
        var service = {
            clear: clear,
            addError: makeAdd(ALERT_TYPE.error),
            addSuccess: makeAdd(ALERT_TYPE.success),
            addWarning: makeAdd(ALERT_TYPE.warning),
            getErrors: makeGet(ALERT_TYPE.error),
            getSuccesses: makeGet(ALERT_TYPE.success),
            getWarnings: makeGet(ALERT_TYPE.warning),
            clearErrors: makeClear(ALERT_TYPE.error),
            clearWarnings: makeClear(ALERT_TYPE.warning),
            clearSuccesses: makeClear(ALERT_TYPE.success)
        };

        return service;

        function clear() {
            init();
        }
        function makeClear(type) {
            return function() {
                alerts[type] = [];
            };
        }
        function makeAdd(type) {
            return function (message) {
                var alert = {msg : message};
                alerts[type].push(alert);
            };
        }
        function makeGet(type) {
            return function () {
                return alerts[type];
            };
        }
        function init() {
            alerts = {};
            alerts[ALERT_TYPE.error] = [];
            alerts[ALERT_TYPE.success] = [];
            alerts[ALERT_TYPE.warning] = [];
        }
    }
})();

(function() {
    'use strict';
    angular.module('shared.alerts')
        .constant('ALERT_TYPE', {
            success: 'alert-success',
            error: 'alert-danger',
            warning: 'alert-warning'
        });
})();

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
                tableService.addHeadersToRows($tableElement);
            }
        };
    }

    //////////////
    // Services //
    //////////////
    function tableService() {
        function addHeadersToRows(element) {
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
            addHeadersToRows: addHeadersToRows
        };
    }
})();

(function() {
    'use strict';
    angular.module('auth', []);
})();

(function() {
    'use strict';
    angular.module('auth')
        .controller('LoginController', LoginController);

    function LoginController($location, AuthService, AlertsService) {
        var vm = this;

        if (AuthService.isUserAuthenticated()) {
            AlertsService.clear();
            $location.path('/komisja-obwodowa/lista');
        }

        vm.credentials = {};
        vm.login = function() {

            AuthService.login(vm.credentials)
                .then(
                    function(response) {
                        console.log('login response:');
                        console.log(response);
                        if (response.status === 200) {
                            AlertsService.clear();
                            $location.path('/komisja-obwodowa/lista');
                        } else {
                            AlertsService.addError('Błędne dane logowania 1');
                        }

                    },
                    function() {
                        AlertsService.addError('Błędne dane logowania');
                    });

        };
    }
    LoginController.$inject = ['$location', 'AuthService', 'AlertsService'];
})();

(function() {
    'use strict';
    angular.module('auth')
        .controller('LogoutController', LogoutController);
    LogoutController.$inject = ['AuthService', 'AlertsService'];
    function LogoutController(AuthService, AlertsService) {
        AlertsService.clear();
        AuthService.logout().then(function() {
            AlertsService.addSuccess('Zostałeś wylogowany');
        });
    }
})();

(function() {
    'use strict';
    angular.module('komisja-obwodowa', []);
})();

(function() {
    'use strict';
    angular
        .module('komisja-obwodowa')
        .controller('KomisjaObwodowaController', KomisjaObwodowaController);
    KomisjaObwodowaController.$inject = ['$stateParams', '$location', 'KomisjaObwodowaService',
        'AlertsService'];

    function KomisjaObwodowaController($stateParams, $location,
            KomisjaObwodowaService, AlertsService) {

        var vm = this;
        vm.submit = submit;
        vm.votes = {
                    glosowWaznych: 100,
                    glosujacych: 10,
                    k1: 12,
                    k2: 3,
                    k3: 13,
                    k4: 12,
                    k5: 16,
                    k6: 12,
                    k7: 18,
                    k8: 15,
                    k9: 18,
                    k10: 19,
                    k11: 15,
                    glosowNieWaznych: 17,
                    kartWaznych: 11,
                    uprawnionych: 661
                };

        vm.labels = {
            uprawnionych : 'Uprawnionych do głosowania',
            glosujacych: 'Głosujących',
            kartWaznych: 'Kart ważnych',
            glosowNieWaznych: 'Głosów nieważnych',
            glosowWaznych: 'Głosów ważnych'
        };

        vm.numbers = [];
        KomisjaObwodowaService.getById($stateParams.id).then(function(response) {
            vm.data = JSON.stringify(response.data);
            vm.komisja = response.data;

        }, function(response) {
            if (parseInt(response.status, 10) === 404) {
                AlertsService.addError('Wybrana komisja nie istnieje.');
            } else {
                AlertsService.addError('Nie udało się pobrać danych komisji. (status: ' +
                response.status + ' ' + response.statusText + ')');
            }
            $location.path('/komisja-obwodowa/lista');
        });

        function submit(isValid) {
            vm.submitted = true;
            console.log(vm.form);
            if (vm.form.$valid) {
                console.log(vm.votes);
                KomisjaObwodowaService.uploadProtocol($stateParams.id, vm.votes).then(
                    function(response) {
                        if (response.status === 200) {
                            $location.path('/komisja-obwodowa/lista');
                            AlertsService.addSuccess('Dane zostały przesłane na serwer.');
                        } else {
                            AlertsService.addError('Błąd podczas przesyłania danych.');
                        }
                    },
                    function() {
                        AlertsService.addError('Błąd podczas przesyłania danych');
                    });
            } else {
                vm.form.submitted = true;
            }
        }
    }
})();

(function () {
    'use strict';
    angular
        .module('komisja-obwodowa')
        .service('KomisjaObwodowaService', ['$http', '$q', KomisjaObwodowaService]);
    function KomisjaObwodowaService($http, $q) {
        var service = {
            getById: getById,
            getForUser: getForUser,
            uploadProtocol: uploadProtocol,
            getProtocols: getProtocols,
            getProtocolDetails: getProtocolDetails,
            rateProtocolNegative: rateProtocolNegative,
            rateProtocolPositive: rateProtocolPositive
        };
        return service;
        function getById(id) {
            return $http.get('/rest-api/service/komisja/' + id);
        }
        function getForUser(userId) {
            var deferred = $q.defer();

            $http.get('/rest-api/service/user/' + userId + '/obwodowa').then(function(response) {
                deferred.resolve({komisje: response.data});
            });
            return deferred.promise;
        }
        function uploadProtocol(pkwId, protocolData) {
            return $http({
                method: 'POST',
                url: '/rest-api/service/komisja/' + pkwId + '/protokol',
                data: protocolData
            });
        }
        function getProtocols(pkwId) {
            var deferred = $q.defer();

            $http.get('/rest-api/service/komisja/' + pkwId + '/protokol').then(function(response) {
                deferred.resolve({protocols: response.data});
            });
            return deferred.promise;
        }
        function getProtocolDetails(protocolId) {
            var deferred = $q.defer();
            $http.get('/rest-api/service/wynik/' + protocolId).then(function(response) {
                deferred.resolve({protocol: response.data});
            });
            return deferred.promise;
        }
        function rateProtocolPositive(protocolId) {
            var deferred = $q.defer();
            $http.get('/rest-api/service/wynik/' + protocolId + '/positive').then(
                function(response) {
                    deferred.resolve({protocol: response.data});
                });
            return deferred.promise;
        }
        function rateProtocolNegative(protocolId) {
            var deferred = $q.defer();
            $http.get('/rest-api/service/wynik/' + protocolId + '/negative').then(
                function(response) {
                    deferred.resolve({protocol: response.data});
                });
            return deferred.promise;
        }
    }
})();

(function() {
    'use strict';
    angular.module('komisja-obwodowa')
        .controller('KOListaController', KOListaController);

    KOListaController.$inject = ['$stateParams', 'KomisjaObwodowaService',
        'SessionService', 'AlertsService', '$location'];

    function KOListaController($stateParams, KomisjaObwodowaService, SessionService,
        AlertsService, $location) {
        var vm = this,
            currentPage = parseInt($stateParams.page, 10),
            lastPage,
            itemsPerPage = 6,
            visibleFrom = 0,
            visibleTo = 10,
            items;
        var userId = SessionService.getUserId();
        vm.selectedPkwId = null;
        vm.submitManualCommissionSelectionForm = submitManualCommissionSelectionForm;
        KomisjaObwodowaService.getForUser(userId).then(function(response) {
            items = response.komisje;
            visibleFrom = Math.floor(itemsPerPage * (currentPage - 1));
            visibleTo = visibleFrom + itemsPerPage;
            lastPage = Math.ceil(items.length / itemsPerPage);

            vm.items = items;
            vm.visibleFrom = visibleFrom;
            vm.visibleTo = visibleTo;
            vm.itemsPerPage = itemsPerPage;
            vm.currentPage = currentPage;
            vm.lastPage = lastPage;
        }, function(response) {
            AlertsService.addError('Nie udało się pobrać listy komisji. (status: ' +
                response.status + ' ' + response.statusText + ')');
        });

        function submitManualCommissionSelectionForm(isValid) {
            vm.submitted = true;
            vm.manualCommissionSelectionForm.submitted = true;
            if (vm.manualCommissionSelectionForm.$valid) {
                $location.path('/komisja-obwodowa/' + vm.selectedPkwId);
            } else {
                vm.manualCommissionSelectionForm.submitted = true;
            }
        }
    }
})();

(function() {
    'use strict';
    angular
        .module('komisja-obwodowa')
        .controller('KOWgraneProtokolyController', KOWgraneProtokolyController);
    KOWgraneProtokolyController.$inject = ['$stateParams', 'KomisjaObwodowaService',
             'AlertsService'];
    function KOWgraneProtokolyController($stateParams, KomisjaObwodowaService, AlertsService) {
        var vm = this,
                currentPage = parseInt($stateParams.page, 10),
                lastPage,
                itemsPerPage = 6,
                visibleFrom = 0,
                visibleTo = 10;
        vm.commisionId = $stateParams.id;
        KomisjaObwodowaService.getProtocols($stateParams.id).then(
            function(response) {
                vm.protocols = response.protocols;
                visibleFrom = Math.floor(itemsPerPage * (currentPage - 1));
                visibleTo = visibleFrom + itemsPerPage;
                lastPage = Math.ceil(response.protocols.length / itemsPerPage);

                vm.visibleFrom = visibleFrom;
                vm.visibleTo = visibleTo;
                vm.itemsPerPage = itemsPerPage;
                vm.currentPage = currentPage;
                vm.lastPage = lastPage;

            },
            function() {
                AlertsService.addError('Nie udało się pobrac listy protokolow dla komisji: ' +
                    $stateParams.id);
            });
    }
})();

(function () {
    'use strict';
    angular
        .module('komisja-obwodowa')
        .controller('KOProtokolController', KOProtokolController);

    KOProtokolController.$inject = ['$stateParams', '$location',
                        'AlertsService', 'KomisjaObwodowaService'];
    function KOProtokolController($stateParams, $location, AlertsService, KomisjaObwodowaService) {
        var vm = this;
        vm.labels = {
            uprawnionych : 'Uprawnionych do głosowania',
            glosujacych: 'Głosujących',
            kartWaznych: 'Kart ważnych',
            glosowNieWaznych: 'Głosów nieważnych',
            glosowWaznych: 'Głosów ważnych'
        };
        vm.ratePositive = ratePositive;
        vm.rateNegative = rateNegative;
        KomisjaObwodowaService.getProtocolDetails($stateParams.protocolId).then(
            function(response) {
                vm.protocol = response.protocol;
                KomisjaObwodowaService.getById($stateParams.commisionId).then(
                    function(response) {
                        vm.commision = response.data;
                    },
                    function() {
                        AlertsService.addError('Nie udało się pobrac danych komisji.');
                    });
            },
            function() {
                AlertsService.addError('Nie udało się pobrac danych protokołu.');
            });
        function ratePositive() {
            KomisjaObwodowaService.rateProtocolPositive($stateParams.protocolId)
                .then(rateResultSuccess, rateResultFailure);
        }
        function rateNegative() {
            KomisjaObwodowaService.rateProtocolNegative($stateParams.protocolId)
                .then(rateResultSuccess, rateResultFailure);
        }
        function rateResultSuccess() {
            AlertsService.addSuccess('Głos został przyjęty.');
            $location.path('komisja-obwodowa/' + $stateParams.commisionId + '/wgrane-protokoly/');
        }
        function rateResultFailure() {
            AlertsService.addSuccess('Wystąpił błąd. Głos nie został przyjęty.');
            $location.path('komisja-obwodowa/' + $stateParams.commisionId + '/wgrane-protokoly/');
        }

    }
})();


(function() {
    'use strict';
    angular.module('shared.controls.pagination', []);
})();

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
