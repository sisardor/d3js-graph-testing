'use strict';

/**
 * @ngInject
 */
function Routes($stateProvider, $locationProvider, $urlRouterProvider) {

  $locationProvider.html5Mode(true);

  $stateProvider
  .state('Home', {
    url: '/',
    controller: 'ExampleCtrl as home',
    templateUrl: 'home.html',
    title: 'Home'
  });

  $stateProvider
  .state('Css', {
    url: '/css',
    controller: 'TestCssCtrl',
    templateUrl: 'test-css.html',
    title: 'CSS'
  });

  $urlRouterProvider.otherwise('/css');

}

module.exports = Routes;