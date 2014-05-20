
var app = angular.module('app', []);

app.controller('mainCtrl', function($scope){

});

app.controller('contentCtrl', function($scope, $http){

  console.log('got here');
  $http({
    method: 'GET',
    url: '/requests'

  }).success(function(data, status) {
    $scope.details = data;
    console.log('successful data and status: ',data, status);
    console.log('type: ', typeof data);

  }).error(function(data, status){
    console.log('unsuccessful error getting data', data, status);
  });

  $scope.acceptOffer = function(id, rest){

    console.log('id: ', id, 'rest: ', rest)
    var postData = {requestId: id, businessName: rest};

    $http({
      method: 'POST',
      url: '/acceptOffer',
      data: postData


    }).success(function(data, status) {
      // $scope.details = data;
      console.log('successful data and status: ',data, status);
      console.log('type: ', typeof data);

    }).error(function(data, status){
      console.log('unsuccessful error getting data', data, status);
    });
  }
});
