"use strict"
angular.module('routerApp')
    .service('AppService', ['$http', function ($http) {
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        // this.appList = request.AppService.appList($http)
    }])
    .controller('listCtrl', ['$scope', 'AppService',
        function ($scope, AppService) {

        }]);
