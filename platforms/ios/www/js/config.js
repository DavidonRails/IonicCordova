
app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    })
    .state('signup',{
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'LoginController'
    })

    // --- Terms and Co for making a donation
    .state('terms-and-conditions', {
      url: '/terms_and_conditions',
      templateUrl: 'templates/terms_and_conditions.html'
    })

    // --- Page listing all the users donations
    .state('donations', {
      url: '/donations',
      templateUrl: 'templates/donations/donations.html',
      controller: 'ViewDonationController'
    })

    // --- Page displaying just 1 of the users donations
    .state('viewDonation', {
      url: '/donations/:id/view',
      templateUrl: 'templates/donations/donation-view.html',
      controller: 'ViewDonationController'
    })

    //--Routes for tabs
    .state('tabs', {
      url: '/tab', //-- actual address
      abstract: true, //--never actualy going to navagate away from this template
      templateUrl: 'templates/tabs.html'

    })
    .state('tabs.dashboard', { //--child template of tabs
      url: '/dashboard',
      views: {
        'dashboard-tab' : { //--name of view
        templateUrl: 'templates/dashboard.html'
        //controller: 'DashboardController'
        }
      }
    })
    .state('tabs.donate', { //--child template of tabs
      url: '/donations/new',
      views: {
        'donate-tab' : {
        templateUrl: 'templates/donations/donation-new.html',
        controller: 'CreateDonationController'
        }
      }
    })
    .state('tabs.shop', {
      url: '/shop',
      views: {
        'shop-tab' : {
        templateUrl: 'templates/shop.html'
        //controller: 'DashboardController'
        }
      }
    })
    .state('tabs.settings', {
      url: '/settings',
      views: {
        'settings-tab' : {
        templateUrl: 'templates/settings.html'
        //controller: 'DashboardController'
        }
      }
    })

    $urlRouterProvider.otherwise('/login'); //--default go to page
});
