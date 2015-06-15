'use strict';

angular.module('4screens.engageform').directive( 'higherThanWindow', function( $document, $window, $timeout ) {
  var $body = angular.element( $document.find('body').eq( 0 ) );

  return {
    link: function( scope, element ) {
      function checkHeight () {
        scope.$applyAsync(function() {
          var height = element[0].clientHeight;

          // Add class on the body
          // FIXME: Shouldn't really be a part of the directive.
          if (element[0].clientHeight > $window.innerHeight) {
            $body.addClass('higher-than-window');
          } else {
            $body.removeClass('higher-than-window');
          }

          // Inform the parent window (in the embedded environment) about size change.
          // FIXME: Shouldn't really be a part of the directive.
          $window.parent.postMessage( height, '*' );

          // When the app is embedded, the embed script can change the window size, what leads to resize of
          // some elements. It has impact on the element's height, so it has to be checked again.
          $timeout(function() {
            if ( height !== element[0].clientHeight ) {
              checkHeight();
            }
          }, 50 );
        })
      }

      checkHeight();
    }
  };
});
