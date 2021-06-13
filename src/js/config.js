'use strict';
const APPName = 'routerApp'

function resolve(provider, ...file) {
  return provider.load({
    name: APPName,
    files: file
  });
}

const _page_config = {
  pageSize: 10,
  currentPageIndex: 1,
  totalPage: 1,
  totalCount: 0
};

const value = {
  home: {
    word: 'home',
    url: '/home',
    templateUrl: 'views/home.html', resolve: {
      loadMyDirectives: ['$ocLazyLoad', function ($ocLazyLoadProvider) {
        return $ocLazyLoadProvider.load({
          name: APPName,
          files: ['js/biz/header/header.js', 'js/biz/sidebar/sidebar.js']
        });
      }]
    }
  },
  homeHome: {
    word: 'home.home',
    url: '/home',
    templateUrl: 'js/biz/ctrl/app/appList.html',
    resolve: {
      loadMyDirectives: ['$ocLazyLoad', function ($ocLazyLoadProvider) {
        return $ocLazyLoadProvider.load({
          name: APPName,
          files: ['js/biz/ctrl/app/appCtrl.js']
        });
      }]
    }
  },
  homeEdit: {
    word: 'home.edit',
    url: '/edit/{appId}/{appName}',
    templateUrl: 'js/biz/ctrl/all/all.html',
    controller: 'detailController',
    resolve: {
      loadMyDirectives: ['$ocLazyLoad', function ($ocLazyLoadProvider) {
        return $ocLazyLoadProvider.load({
          name: APPName,
          files: ['js/biz/ctrl/all/allCtrl.js']
        });
      }]
    }
  }
}
