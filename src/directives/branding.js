'use strict';

angular.module('4screens.engageform').directive( 'branding',
  function( EngageformBackendService, $rootScope, CONFIG ) {
    var _link = function( $scope ) {
      var _default = {
            text: CONFIG.backend.branding.defaultText,
            link: CONFIG.backend.branding.defaultLink,
            imageUrl: CONFIG.backend.branding.defaultImgUrl
          },

      _brandingIsDefault = function() {
        var defaultBranding = true;

        _.forIn( _default, function( val, key ) {
          if ( $scope.branding[ key ] !== val ) {
            defaultBranding = false;
          }
        });

        return defaultBranding;
      };

      $rootScope.$on( 'quizReady', function() {

        $scope.branding = $scope.quiz.settings.branding;

        if ( $scope.branding.state ) {
          $scope.branding.text = '';
          $scope.branding.link = '';
          $scope.branding.imageUrl = '';
        }

        $scope.defaultBranding = _brandingIsDefault();
      });

      $scope.getBrandingImageSrc = function( src ) {
        if ( src === _default.imageUrl ) {
          return CONFIG.backend.domain + src;
        } else if ( src ) {
          return CONFIG.backend.domain + CONFIG.backend.imagesUrl + '/' + src;
        } else {
          return '';
        }
      };
    };

    return {
      restrict: 'E',
      templateUrl: 'views/engageform/branding-logo.html',
      link: _link
    };
  }
);
