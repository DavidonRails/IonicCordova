//-- This service contains user information for authorization and authentication needs
app.service('currentUserService', function(){
  this.id = null;
  this.token = null;
  this.role = null;
});

//-- This service handles all authentication between app and Chatter API
app.service('authService', function($http, currentUserService, CHATTER_API){
  this.login = function(user){
    
    return  $http({method: 'POST',
                   url: 'api/login',
                   headers: {'X-API-EMAIL' : user.email, 'X-API-PASS' : user.password}})
      .success( function( data )
      {
        // TODO:

        //{"id":211,"auth_token":"u3BHXB1MCTsZj97yAZfK"}

        console.log('Return Data From Login Post to Api:', JSON.stringify(data));
        currentUserService.token = data.auth_token;
        currentUserService.id = data.id;
        currentUserService.role = 'admin';

        //--Set header for all subsequent requests
        $http.defaults.headers.common['Authorization'] = data.auth_token;

      });
  }; //--End of login function

  this.logout = function(user){
    return  $http({method: 'POST', url: 'api/logout', headers: {'Authorization' : user.token}});
  };// --End of logout function
});

app.service('donationCategoryService', function($http, CHATTER_API){
  this.getCategories = function(){
    console.log('Inside getCategories function...')
    return $http({method: 'GET',
                  url: CHATTER_API.url + '/categories'})
      .success(function(data)
      {
        console.log('Donation Categories data from api: ', data);
      })
      .error(function(data)
      {
        console.log('Error:', data)
        error(data);
      });
    }
});

app.service('s3SigningService', function($http, CHATTER_API){
  this.getSignature = function(fileName){
    console.log('Contacting s3 signing service from api...')
    return $http({method: 'GET',
                  url: CHATTER_API.url + '/s3_access_signature',
                  headers: {'X-API-FILENAME' : fileName}})
    .success(function(data)
    {
      console.log('Successfully got s3 Signature from API', data)
    })
    .error(function(data)
    {
      console.log('Failure to get s3 Signature from API')
      error(data);
    });
  }
});
