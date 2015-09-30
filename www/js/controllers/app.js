'use strict'

app.controller('AppController', function($state, $scope, $ionicHistory, $ionicPopup, authService) {

  // $scope.$on(AUTH_EVENTS.notAuthorized, function(event){
  //   var alertPopup = $ionicPopup.alert({
  //     title: 'Unathorized',
  //     template: 'You are not allowed to acces this resource.'
  //   });
  // });
  //
  // //--When not authorized event is broadcast..
  // $scope.$on(AUTH_EVENTS.notAuthenticated, function(event){
  //   authService.logout();
  //   $state.go('login');
  //   var alertPopup = $ionicPopup.alert({
  //     title: 'Session lost',
  //     template: 'Sorry, You must log in again.'
  //   });
  // });

});
