app.factory('Need', function($resource, CHATTER_API) {
  return $resource(CHATTER_API.url +'/needs/:id');
});

app.factory('Donation', function($resource, CHATTER_API) {
  return $resource(CHATTER_API.url +'/resources/:id',
  { 'get':    {method:'GET', isArray:false},
    'save':   {method:'POST'},
    'query':  {method:'GET'},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} }
  );
});

// app.factory('Camera', ['$q', function($q) {
//
//   return {
//     getPicture: function(options) {
//       var q = $q.defer();
//       console.log("get Picture function")
//       navigator.camera.getPicture(function(result) {
//         console.log("Camera Magic")
//         q.resolve(result);
//       }, function(err) {
//         q.reject(err);
//         console.log("Error")
//       }, options);
//
//       return q.promise;
//     }
//   }
// }]);
