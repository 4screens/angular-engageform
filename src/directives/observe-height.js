'use strict';

angular.module('4screens.engageform').directive( 'observeHeight', function( $window, $timeout ) {
  return {
    link: function( scope, element ) {
      var timeout;

      /**
       * Returns the element's client height.
       * @returns {number}
       */
      function getHeight() {
        return element[0].clientHeight;
      }

      /**
       * Emits the event containing information about the element's height and if it is higher than the window.
       * @param {number} height Element's height.
       */
      function emit( height ) {
        scope.$emit( 'height-changed', {
          height: height,
          isHigherThanViewport: height > $window.innerHeight
        } );
      }

      /**
       * Polls the height checking and handles differences.
       */
      function pollHeight() {
        var height = getHeight();

        // When the app is embedded, the embed script can change the window size, what leads to resize of
        // some elements. It has impact on the element's height, so it has to be checked again.
        timeout = $timeout(function() {
          var innerHeight = getHeight();

          // If the height hasn't stabilised yet, schedule another check.
          if ( height !== innerHeight ) {
            emit( innerHeight );

            // Polling
            pollHeight();
          }

        }, 50 );
      }

      scope.$on( '$destroy', function() {
        $timeout.cancel( timeout );
      } );

      // Check the height when the scope stabilizes.
      scope.$applyAsync( function() {
        emit(getHeight());
        pollHeight();
      } );
    }
  };
});
