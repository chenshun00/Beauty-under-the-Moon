"use strict"
angular.module(APPName)
    .service('AllService', ['$http', function ($http) {

      $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

      this.getStaff = function (appId, tenantId) {
        const data = {appId: appId, tenantId: tenantId}
        return request.AllService.getStaff($http, data)
      };

      this.getOrg = function (appId, tenantId) {
        const data = {appId: appId, tenantId: tenantId}
        return request.AllService.getOrg(appId, data)
      }
    }])

    .controller('detailController', ['AllService', '$scope', '$stateParams', 'Popup', function (AllService, $scope, $stateParams, Popup) {
      const appId = $stateParams.appId;//传递近来的ID参数
      const appName = $stateParams.appName;//传递近来的ID参数

      $scope.content = {fc: {activeTab: 1}, fcc: {activeTab: 1}, staffList: [], org: [], classFie: [], appName: appName}

      $scope.init = function () {
        tabFun(1, 1)
        tabFun(2, 1)
      }

      $scope.tabFun = function (tabIndex, tab) {
        tabFun(tabIndex, tab);
      }

      $scope.choose = function ($event, staff) {
        $event.stopPropagation();//阻止冒泡
        staff.checked = !staff.checked
      };

      function tabFun(tabIndex, tab) {
        if (tabIndex === 1) {
          $scope.content.fc.activeTab = tab
          if (tab === 1) {
            AllService.getStaff(appId, tenantId).success(function (data) {
              $scope.content.staffList = data.data
            });
          } else if (tab === 2) {

          } else if (tab === 3) {

          }
        } else if (tabIndex === 2) {
          $scope.content.fcc.activeTab = tab
          if (tab === 1) {

          } else if (tab === 2) {

          }
        } else {
          alert("数据不对");
        }
      }
    }]);