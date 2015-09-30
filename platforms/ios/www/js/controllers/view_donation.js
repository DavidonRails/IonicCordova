'use strict'

//--Handles User Resources
app.controller('ViewDonationController', function($scope, $state, $stateParams, Donation){
  $scope.donations = Donation.query();
  //$scope.donation = Donation.get({ id: $stateParams.id });

  $scope.viewDonation = function(id){
    $state.go('viewDonation({id:id})')
  }
});
