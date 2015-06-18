'use strict';

angular.module('4screens.engageform').directive( 'questionInitialized', function( $document, $window, $timeout ) {
  return {
    link: function( scope, element ) {
      function checkHeight() {
        var height = element[0].clientHeight;

        // When the app is embedded, the embed script can change the window size, what leads to resize of
        // some elements. It has impact on the element's height, so it has to be checked again.
        $timeout(function() {
          // If the height hasn't stabilised yet, schedule another check.
          if ( height !== element[0].clientHeight ) {
            checkHeight();
          } else {
            scope.$emit( 'container-initialized', {
              height: height,
              isHigherThanViewport: height > $window.innerHeight
            } );
          }
        }, 50 );
      }

      // Check the height when the scope stabilizes.
      scope.$applyAsync( checkHeight );
    }
  };
});
