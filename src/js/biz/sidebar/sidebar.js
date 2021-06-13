angular.module(APPName)
    .directive('sidebar', ['$stateParams', function () {
        return {
            templateUrl: 'js/biz/sidebar/sidebar.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope, $stateParams, $location) {
                // $scope.$on('root-account-change', function (event, data) {
                //     $scope.account = $rootScope.account;
                // });
                const info = "{\"code\":0,\"msg\":\"success\",\"data\":[{\"app\":\"功能列表\"}]}";
                const data = JSON.parse(info);
                const initHashApp = $location.path().split('/')[3];
                $scope.apps = data.data;
                console.log($scope.apps);
                $scope.apps.forEach(function (item) {
                    if (item.app === initHashApp) {
                        item.active = true;
                    }
                });
                // toggle side bar
                $scope.click = function ($event) {
                    const element = angular.element($event.target);
                    const entry = angular.element($event.target).scope().entry;
                    entry.active = !entry.active;

                    if (entry.active === false) {
                        element.parent().children('ul').hide();
                    } else {
                        element.parent().parent().children('li').children('ul').hide();
                        element.parent().children('ul').show();
                    }
                };

                /**
                 * @deprecated
                 */
                $scope.addSearchApp = function () {
                    let findApp = false;
                    for (let i = 0; i < $scope.apps.length; i++) {
                        if ($scope.apps[i].app === $scope.searchApp) {
                            findApp = true;
                            break;
                        }
                    }
                    if (!findApp) {
                        $scope.apps.push({app: $scope.searchApp});
                    }
                };
            }
        }
    }]);
