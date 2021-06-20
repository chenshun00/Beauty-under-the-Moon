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
                $scope.markColor = '#555';
                $scope.sidebarProject = {projectInfo: [], projectId: '请选择项目'};
                ProjectService.getBusiness().success(function (result) {
                    const projectId = $location.path().split('/')[5];
                    let action = $location.path().split('/')[3];
                    const data = result.listApiDetails;
                    let first = false;
                    data.forEach(function (item) {
                        const temp = {
                            projectId: item.projectId,
                            categories: item.categories,
                            projectName: item.projectName
                        };
                        if (projectId === undefined) {
                            if (!first) {
                                first = true
                                action = 'nothing'
                                $scope.sidebarProject.projectId = item.projectId
                            }
                        } else if (projectId === item.projectId) {
                            $scope.sidebarProject.projectId = item.projectId
                        }
                        $scope.sidebarProject.projectInfo.push(temp)
                    });
                    $scope.projectChange($scope.sidebarProject.projectId, action)
                })

                $scope.projectChange = function (projectId, action) {
                    $scope.apps = [];
                    $scope.sidebarProject.projectInfo.forEach(function (item) {
                        if (item.projectId === projectId) {
                            item.categories.forEach(function (zz) {
                                const app = {catName: zz.catName, apiDetails: zz.apiDetails};
                                zz.apiDetails.forEach(function (a) {
                                    if (a.action === action) {
                                        app.active = true
                                        $scope.markColor = '#E70A0AFF';
                                    }
                                })
                                $scope.apps.push(app);
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
