angular.module(APPName)
    .service('ProjectService', ['$http', function ($http) {
        this.getBusiness = function () {
            return $http({url: _domain + '/api/front/projects', method: 'GET'});
        }
    }])
    .directive('sidebar', ['$stateParams', 'ProjectService', function () {
        return {
            templateUrl: 'js/biz/sidebar/sidebar.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope, $stateParams, $location, ProjectService) {
                ProjectService.getBusiness().success(function (result) {
                    //const info = "{\"code\":0,\"msg\":\"success\",\"data\":[{\"tutorials\":\"功能列表\"}]}";
                    const initHashApp = $location.path().split('/')[3];
                    $scope.apps = result.listApiDetails;
                    $scope.apps.forEach(function (item) {
                        if (item.projectName === initHashApp) {
                            item.active = true;
                        }
                    });
                })

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
                        if ($scope.apps[i].projectName === $scope.searchApp) {
                            findApp = true;
                            break;
                        }
                    }
                    if (!findApp) {
                        $scope.apps.push({projectName: $scope.searchApp});
                    }
                };
            }
        }
    }]);
