'use strict';

angular.module('4screens.engageform').factory( 
  'CloudinaryService',
  [ 'CONFIG',
    function ( CONFIG ) {
      // cloudinaryUrl - Cloudinary cloud name, this need to be added to your CONFIG file
      var cloudinaryUrl = CONFIG.backend.cloudinaryUrl || 'http://res.cloudinary.com/test4screens/image/fetch/';

      return {
        getImgUrl: function ( src, w, dpr, blur ) {
          var blur = typeof blur !== 'undefined' && blur !== '0' ? ',e_blur:' + parseInt( blur, 10 ) * 100 + '/' : '/'
          , dpr = ',dpr_' + dpr;
          
          return cloudinaryUrl + 'w_' + parseInt( w, 10 ) + ',c_limit' + dpr + blur + src;
        },
        getMainImgUrl: function ( src, sw, w, h, ox, oy ) {
          return cloudinaryUrl + 'w_' + parseInt( sw, 10 ) + '/' + 'w_' + w + ',h_' + h + ',x_' + ox + ',y_' + oy + ',c_crop/' + src;
        }
      };
    } ]
);