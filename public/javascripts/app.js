
var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('dashboard',{
      url: '/',
      template: '<h1>hihdshdais</h1>',
      controller: 'userDashCtrl'

      // templateUrl: 'html/partial-activeRequests.html',
    });
});

app.controller('mainCtrl', function($scope,$state){
  // $state.go('home');
});

app.controller('userDashCtrl', function($scope, $http){

});