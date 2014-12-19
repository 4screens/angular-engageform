'use strict';

angular.module('4screens.engageform').directive( 'engageformSwiperDirective',
  function( $timeout ) {
    return {
      restrict: 'C',
      link: function ( scope ) {
        var instance
          , params = {
              slideElement: 'article',
              slidesPerView: 1,
              pagination: '.pagination',
              calculateHeight: true,
              roundLengths: true,
              resizeReInit: true
            };

        // This code will run after template has been loaded
        // and transformed by directives
        // and properly rendered by the browser
        $timeout( function() {
          $timeout( function() {
            $timeout( function() {
              $timeout( function() {
                instance = new Swiper( '.engageform-swiper-directive', params );
                scope.swipeNext = instance.swipeNext;
                scope.swipePrev = instance.swipePrev;
              });
            });
          });
        });
      }
    };
  }
);
