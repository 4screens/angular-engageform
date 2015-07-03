'use strict';

angular.module('4screens.engageform').directive( 'branding',
  function( EngageformBackendService, $rootScope, CONFIG ) {
    var _link = function( $scope ) {
      var _default = CONFIG.backend.branding,
          _defaultBranding,
          _getBrandingImageSrc,
          _getBrandingLink;

      _defaultBranding = function() {
        $scope.defaultBranding = _.isUndefined( $scope.branding.link ) && _.isUndefined( $scope.branding.imageUrl );
      };

      _getBrandingImageSrc = function( src ) {
        if ( !_.isUndefined( src ) && src !== _default.imageUrl ) {
          return CONFIG.backend.domain + CONFIG.backend.imagesUrl + '/' + src;
        } else if ( src === '' ) {
          return '';
        } else {
          return CONFIG.backend.domain + _default.imageUrl;
        }
      };

      _getBrandingLink = function( link ) {
        if ( _.isUndefined( link ) ) {
          return _default.link;
        } else {
          return link;
        }
      };

      $rootScope.$on( 'quizReady', function() {

        $scope.branding = $scope.quiz.settings.branding;

        if ( $scope.branding.state ) {
          $scope.branding.text = '';
          $scope.branding.link = '';
          $scope.branding.imageUrl = '';
        } else {
          _defaultBranding();
          $scope.branding.imageUrl = _getBrandingImageSrc( $scope.branding.imageUrl );
          $scope.branding.link = _getBrandingLink( $scope.branding.link );
        }
      });
    };

    return {
      restrict: 'E',
      templateUrl: 'views/engageform/branding-logo.html',
      link: _link
    };
  }
);
