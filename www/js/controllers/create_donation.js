'use strict'

app.controller('CreateDonationController', function($scope,
                                                    $state, $stateParams, $http,
                                                    $ionicPopup, $ionicPlatform, $ionicModal, $ionicLoading,
                                                    $cordovaCamera, $cordovaFileTransfer, $timeout,
                                                    donationCategoryService, s3SigningService, currentUserService,
                                                    Donation,
                                                    CHATTER_API) {
  $scope.donation = new Donation();
  //--TODO: Can i put this in the Donation factory?
  $scope.donation.location_attributes = {
    street: "",
    postal_code: "",
    city: "",
    state: ""
  };
  // $scope.categories = {};
  //
  // donationCategoryService.getCategories().success(data){
  //   $scope.categories = data;
  // };

  $scope.addDonation = function() { //create a new donation. Issues a POST to /api/resources/new
    $scope.donation.$save()
      .then(function(resp) {
        var alertPopup = $ionicPopup.alert({
          title: 'Success',
          template: "Your donation has been successfully uploaded to Creative Chatter. Check notifications for a match."
        });
        $state.go('viewDonation', {id :resp.id}); // on success go back to home i.e. donations state.
      })
      .catch(function(resp){
        console.log("REsponse: ", resp.data)
        var alertPopup = $ionicPopup.alert({
          title: 'Failed',
          // template: "Sorry something went wrong. If this problem continues please contact Creative Chatter at support@creativechatter.com"
        });
      });
  };

  //-- This method handles select field values for donation title (category)
  $scope.callbackMethod = function (query) {
    console.log("query: ", query)
    //--TODO find method to search categories
    return donationCategoryService.getCategories();
  };

  //-- Method is called when an item is selected inside the category modal
  $scope.categorySelected = function (callback) {
    $scope.donation.title  = callback.item.name;
  };

//   $scope.takePicture = function() {
//     console.log("take picture function")
//  
//     $ionicPlatform.ready(function() {
//         var options = {
//             quality: 50,
//             destinationType: Camera.DestinationType.DATA_URL,
//             sourceType: Camera.PictureSourceType.CAMERA,
//             allowEdit: true,
//             encodingType: Camera.EncodingType.JPEG,
//             targetWidth: 100,
//             targetHeight: 100,
//             popoverOptions: CameraPopoverOptions,
//             saveToPhotoAlbum: false
//         };
//  
//         $scope.takePicture = function() {
//             $cordovaCamera.getPicture(options).then(function(imageData) {
//                 $scope.imgSrc = "data:image/jpeg;base64," + imageData;
//             }, function(err) {
//                 console.log(err);
//             });
//         }
//       });
//     }

var item_photo = "";

$scope.takePicture = function() {

  /*
  Camera.DestinationType = {
      DATA_URL : 0,      // Return image as base64-encoded string
      FILE_URI : 1,      // Return image file URI
      NATIVE_URI : 2     // Return image native URI (e.g., assets-library:// on iOS or content:// on Android)
  };


  Camera.PictureSourceType = {
      PHOTOLIBRARY : 0,
      CAMERA : 1,
      SAVEDPHOTOALBUM : 2
  };
  */

  document.addEventListener("deviceready", function () {
    var options = { 
        quality : 75, 
        destinationType : Camera.DestinationType.FILE_URL, 
        sourceType : Camera.PictureSourceType.PHOTOLIBRARY, 
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
        //item_photo = "data:image/jpeg;base64," + imageData;
        item_photo = imageData;
        var imageTag = document.getElementById('uploading_image');
        imageTag.src = item_photo;
        imageTag.style.display = "block";

        var fileName = currentUserService.id + new Date().getTime() + "_ALBERT.jpg";

        uploadS3(item_photo, fileName);

    }, function(err) {
        alert('Failed because: ' + err);
    });
  }, false);
}

function uploadS3(image, fileName) {
  
    /*
      var bucket = new AWS.S3({params: {Bucket: 'creative_chatter_images_staging'}});
      var params = {Key: name, ContentType: 'image/jpeg', Body: image};
      bucket.upload(params, function(err, data){
        console.log(JSON.stringify(err));
        if(err){ alert(err); }
      });
    */

  document.addEventListener('deviceready', function () {  
      
      $ionicLoading.show({template: 'Image Uploading...', duration:5000});

      $http({
        method: 'GET',
        url: 'api/s3_access_signature',
        headers: {'X-API-FILENAME' : fileName}
      }).success(function(data, status, headers, config) {
        
          console.log('Got signed doc: ', JSON.stringify(data));
          
          /*
          {
            "policy":"eydleHBpcmF0aW9uJzogJzIwMTUtMDktMTVUMjE6Mjg6MjQuMDAwWicsCiAgICAgICAgICAnY29uZGl0aW9ucyc6IFsKICAgICAgICAgICAgeydidWNrZXQnOiAnIzxBV1M6OlMzOjpCdWNrZXQ6MHgwMDdmNzBiMjQxOGM4MD4nfSwKICAgICAgICAgICAgeydhY2wnOiAncHVibGljLXJlYWQnfSwKICAgICAgICAgICAgeydDb250ZW50LVR5cGUnOiAnaW1hZ2UvanBlZyd9LAogICAgICAgICAgICB7J0NvbnRlbnQtRGlzcG9zaXRpb24nOiAnYXR0YWNobWVudCd9LAogICAgICAgICAgICB7J0NhY2hlLUNvbnRyb2wnOiAnbWF4LWFnZT0zMTUzNjAwMCd9LAogICAgICAgICAgICBbJ3N0YXJ0cy13aXRoJywgJyRrZXknLCAnMTQ0MjM1MTkwMTE1OC5qcGcvJ10sCiAgICAgICAgICAgIFsnY29udGVudC1sZW5ndGgtcmFuZ2UnLCAxLCAyMDk3MTUyXQogICAgICAgICAgXX0KICAgICAgICA=",
            "signature":"tG0qRDRbVyzvWkAuWk3OBkBQWeo=",
            "key":"AKIAJ7PLQC6MMER7DLWA",
            "bucket":"creative_chatter_images_staging"
          }
          */

          
          var Uoptions = new FileUploadOptions();
          Uoptions.fileKey = "file";
          Uoptions.fileName = fileName;
          Uoptions.mimeType = "image/jpeg";
          Uoptions.chunkedMode = false;
          Uoptions.httpMethod = "POST";
          Uoptions.headers = {
              connection: "close"
          };

          var expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();
          var policy =
          { "expiration": expiration,
            "conditions": [
              {"bucket": data.bucket},
              {"key": fileName},
              {"acl": 'public-read'},
              ["starts-with", "$Content-Type", ""],
              ["content-length-range", 0, 524288000]
          ]};

          var policyBase64 = JSON.stringify(policy).toString('utf8').toString('base64');
          
          Uoptions.params = {
              "key": fileName,
              "AWSAccessKeyId": data.key, //"AKIAI26DTWXPVJML7Q3A", //
              "acl": "public-read", 
              "policy": data.policy, //policyBase64, //
              "signature": data.signature, //"i1jZcn2E9yWIHi7zNoPDGworfoJD5QeNrEc9D2wW", //
              "Content-Type": "image/jpeg"
          };

          //var ft = new FileTransfer();
          //ft.upload(fileURL, encodeURI("http://some.server.com/upload.php"), win, fail, Uoptions);

          // console.log("URL : " + "https://" + data.bucket + ".s3.amazonaws.com/" + "resources/");
          // console.log("image rul : " + item_photo);
          // console.log(JSON.stringify(Uoptions));
          
          
          var server = encodeURI("https://" + data.bucket + ".s3.amazonaws.com/" );
          $cordovaFileTransfer.upload(server, item_photo, Uoptions).then(
            function(result) {
              console.log("SUCCESS: " + JSON.stringify(result.response));
          }, function(err) {
              console.log("ERROR: " + JSON.stringify(err));
          }, function(progress) {
              $timeout(function () {
                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              });
          });
  
/*
          var win = function (r) {
          console.log("Code = " + r.responseCode);
          console.log("Response = " + r.response);
          console.log("Sent = " + r.bytesSent);
          }

          var fail = function (error) {
              alert("An error has occurred: Code = " + error.code);
              console.log("upload error source " + error.source);
              console.log("upload error target " + error.target);
          }
*/
 //         $cordovaFileTransfer.upload(item_photo, encodeURI("https://" + data.bucket + ".s3.amazonaws.com/" + "resources/"), win, fail, Uoptions);

    }).error(function(data, status, headers, config) { //--End of Success s3 Signing
        console.log(' didnt Got signed doc: ' + JSON.stringify(data));
    });
  }, false);

}



$scope.oldtakePicture = function(imageURI) {
//uploadToS3
      var fileName = currentUserService.id + new Date().getTime() + ".jpg"; //--Name the file
      //var fileName = "ionic.png";
      //$scope.item.picture = 'https://s3-eu-west-1.amazonaws.com/bucket-name/' + fileName;
      console.log('Uploading ' + fileName + ' to S3...');

      $http({method: 'GET',
                    url: CHATTER_API.url + '/s3_access_signature',
                    headers: {'X-API-FILENAME' : fileName}})
      .success(function(data, status, headers, config) {

          console.log('Got signed doc: ', data);
          var Uoptions = new FileUploadOptions();
          Uoptions.fileKey = "file";
          Uoptions.fileName = fileName;
          Uoptions.mimeType = "image/jpeg";
          Uoptions.chunkedMode = false;
          Uoptions.httpMethod = "PUT";
          Uoptions.headers = {
              connection: "close"
          };
          Uoptions.params = {
              "key": fileName,
              "AWSAccessKeyId": data.key, 
              "acl": "public-read",
              "policy": data.policy,
              "signature": data.signature,
              "Content-Type": "image/jpeg"
          };

        $scope.selectPicture = function() {
        document.addEventListener('deviceready', function() {
            console.log("Device is ready..")
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
            };
            $cordovaCamera.getPicture(options).then(function(imageURI) {
                $scope.imageSrc = imageURI;
                $scope.img = imageURI;

            }, function(err) {
                console.log("Did not get image from camera")
                alert(err);
            });

        }, false); // device ready
    }; // Select picture
    console.log(Uoptions);

    var win = function (r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    }

    var fail = function (error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    //var ft = new FileTransfer();
    //ft.upload(fileURL, encodeURI("http://some.server.com/upload.php"), win, fail, Uoptions);
    $cordovaFileTransfer.upload("https://" + data.bucket + ".s3.amazonaws.com/" + "resources/", imageURI, Uoptions);

    }).error(function(data, status, headers, config) { //--End of Success s3 Signing
        console.log(' didnt Got signed doc: ' + JSON.stringify(data));
    });
  } // upload to Amazon s3 bucket

  $ionicModal.fromTemplateUrl('templates/terms_and_conditions.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
});
