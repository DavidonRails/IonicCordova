
var app = angular.module('cc-donor-app', ['ionic',
                                          'ngResource',
                                          'ion-autocomplete',
                                          'ngMessages',
                                          'ngCordova'])
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
            // Stuff in here
    });
});
