"use strict"
angular.module('routerApp')
    .service('AppService', ['$http', function ($http) {
      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
      this.appList = request.AppService.appList($http)
    }])
    .controller('listCtrl', ['$scope', 'AppService',
      function ($scope, AppService) {
        $scope.registerList = [];
        //分页用
        $scope.rulesPageConfig = _page_config

        $scope.initView = function () {
          AppService.appList.success(function (data) {
            if (data.code === 100) {
              $scope.registerList = data.data;
              $scope.rulesPageConfig.totalCount = $scope.registerList.length;
            } else {
              console.log(data);
            }
          })
        };

      }]);
