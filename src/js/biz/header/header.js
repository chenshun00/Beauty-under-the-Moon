/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module(APPName)
  .directive('header', [function () {
    return {
      templateUrl: 'js/biz/header/header.html',
      restrict: 'E',
      replace: true,
      controller: function ($scope) {
          $scope.accounts = ["11","bbb","cc"]
      }
    }
  }]);
