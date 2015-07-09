'use strict';

angular.module('4screens.engageform').factory(
  'CloudinaryService',
  [ 'CONFIG',
    function ( CONFIG ) {
      var accountName = CONFIG.backend.cloudinary.account || 'test4screens'
        , uploadFolderName = CONFIG.backend.cloudinary.uploadFolderName || 'console'
        , imageUrlPrefix = 'http://res.cloudinary.com/' + accountName + '/image/'
        , remoteMediaUrlPrefix = CONFIG.backend.domain.replace( ':subdomain', '' ) + CONFIG.backend.imagesUrl;

      function correctUrl( prms, src ) {
        return imageUrlPrefix + ( src.indexOf( remoteMediaUrlPrefix ) !== -1 ? 'upload/' : 'fetch/' ) + prms + '/' + src.replace( remoteMediaUrlPrefix, uploadFolderName );
      }

      return {
        getImgUrl: function ( src, w, dpr, blur ) {
          var blur = typeof blur !== 'undefined' && blur !== '0' ? ',e_blur:' + parseInt( blur, 10 ) * 100 : ''
          , dpr = ',dpr_' + dpr;

          return correctUrl( 'w_' + parseInt( w, 10 ) + ',f_auto,q_82' + dpr + ',c_limit' + blur, src );
        },
        getMainImgUrl: function ( src, sw, w, h, ox, oy, dpr ) {
          dpr = typeof dpr === 'undefined' ? '' : ',dpr_' + dpr;
          return correctUrl( 'w_' + parseInt( sw, 10 ) + ',f_auto,q_82' + dpr + '/' + 'w_' + w + ',h_' + h + ',x_' + ox + ',y_' + oy + ',c_crop', src );
        }
      };
    } ]
);