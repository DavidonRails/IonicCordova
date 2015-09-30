// .directive('validPrice',function(){
//   return{
//    require: "ngModel",
//    link: function(scope, elm, attrs, ctrl){
//     var regex=/^\d{2,4}(\.\d{1,2})?$/;
//     ctrl.$parsers.unshift(function(viewValue){
//      var floatValue = parseFloat(viewValue);
//      if(regex.test(viewValue)){
//       ctrl.$setValidity('validPrice',true);
//      }
//      else{
//      ctrl.$setValidity('validPrice',false);
//      }
//      return viewValue;
//     });
//    }
//   };
//  });
