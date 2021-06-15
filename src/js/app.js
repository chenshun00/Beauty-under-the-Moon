"use strict";
angular.module(APPName, ['oc.lazyLoad', 'ui.router',
    'ngDialog', 'angularUtils.directives.dirPagination',
    'angular-popups', 'ngMaterial', 'ngMessages'])
    .config(['$stateProvider',
        '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/home/home');

            $stateProvider
                .state(value.home.word, value.home)
                .state(value.homeHome.word, value.homeHome)
                .state(value.homeEdit.word, value.homeEdit)
                .state(value.homeDetail.word, value.homeDetail);
        }]);
