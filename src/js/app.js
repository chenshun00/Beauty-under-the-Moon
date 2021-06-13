"use strict";
let app;
const tenantId = '2988123123123123';
angular.module(APPName, ['oc.lazyLoad', 'ui.router',
  'ngDialog', 'angularUtils.directives.dirPagination',
  'json-tree', 'angular-popups'])
    .config(['$stateProvider',
      '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home/home');

        $stateProvider
            .state(value.home.word, value.home)
            .state(value.homeHome.word, value.homeHome)
            .state(value.homeEdit.word, value.homeEdit);
      }]);