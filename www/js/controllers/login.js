'use strict'

app.controller('LoginController', function($scope, $state, $ionicPopup, authService, currentUserService) {
  $scope.user = {
    email:"justinweathersby@gmail.com",
    password:"test1234"
  }

  $scope.login = function(user) {

    if ($scope.loginForm.$valid){
      authService.login(user).success(function(){
        console.log('Login Success, Token: ', currentUserService.token);
        console.log('Sign-In', user);
        $state.go('tabs.dashboard');
      }).error(function()
      {
        //$state.go('tabs.dashboard');
        var alertPopup = $ionicPopup.alert({    
          title: 'Login Unsuccessful',
          template: "Email and password did not match Chatter's records."
        });
      });
    }
  }; //end of login function

  $scope.goToSignUp = function() {
    $state.go('signup');
  };

  $scope.goToLogin = function() {
    $state.go('login');
  };
});
