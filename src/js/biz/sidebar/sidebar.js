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
            controller: function ($rootScope, $scope, $stateParams, $location, ProjectService) {
                $scope.apps = [];
                $scope.sidebarProject = {projectInfo: [], projectId: '请选择项目'};
                ProjectService.getBusiness().success(function (result) {
                    const initHashApp = $location.path().split('/')[3];
                    let first = false;
                    const data = result.listApiDetails;
                    data.forEach(function (item) {
                        if (!first) {
                            first = true
                            $scope.sidebarProject.projectId = item.projectId
                        }
                        const temp = {
                            projectId: item.projectId,
                            categories: item.categories,
                            projectName: item.projectName
                        };
                        $scope.sidebarProject.projectInfo.push(temp)
                    });
                    $scope.projectChange($scope.sidebarProject.projectId)
                })

                $scope.projectChange = function (projectId) {
                    $scope.apps = [];
                    $scope.sidebarProject.projectInfo.forEach(function (item) {
                        if (item.projectId === projectId) {
                            item.categories.forEach(function (zz) {
                                $scope.apps.push({catName:zz.catName,apiDetails:zz.apiDetails});
                            })
                        }
                    });
                    console.log($scope.apps)
                }

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
