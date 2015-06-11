angular.module('4screens.engageform').directive( 'higherThanWindow', function( $document, $window ) {
  var $body = angular.element( $document.find('body').eq( 0 ) );

  return {
    link: function( scope, element ) {
      scope.$applyAsync( function() {
        if (element[0].clientHeight > $window.innerHeight) {
          $body.addClass('higher-than-window')
        } else {
          $body.removeClass('higher-than-window')
        }
      })
    }
  }
});
