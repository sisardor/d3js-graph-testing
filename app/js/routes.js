'use strict';

/**
 * @ngInject
 */
function Routes($stateProvider, $locationProvider, $urlRouterProvider) {

    $locationProvider.html5Mode(true);

    // $stateProvider
    // .state('Home', {
    //     url: '/',
    //     controller: 'ExampleCtrl as home',
    //     templateUrl: 'home.html',
    //     title: 'Home'
    // });

    var home = {
        name: 'home',
        url: '/',
        controller: 'ExampleCtrl as home',
        templateUrl: 'home.html'
    }

    var dimple = {
        name: 'dimple',
        url: '/dimple',
        controller: 'DimpleGraphCTRL',
        templateUrl: 'dimple.html'
    }

    var css = {
        name: 'css',
        url: '/css',
        controller: 'TestCssCtrl',
        templateUrl: 'test-css.html'
    }

    $stateProvider.state(home);
    $stateProvider.state(dimple);
    $stateProvider.state(css);

  // $stateProvider
  // .state('Graph2', {
  //   url: '/dimple',
  //   controller: 'DimpleGraphCtrl as dimple',
  //   templateUrl: 'dimple.html',
  //   title: 'Graph2'
  // });

  //$urlRouterProvider.otherwise('/css');

}

module.exports = Routes;