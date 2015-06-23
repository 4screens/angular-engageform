'use strict';
angular.module('4screens.engageform')
  .factory( 'openInFullscreen', function( $document ) {
    var body = $document[0].body;

    return function() {

      if (body.requestFullscreen) {
        body.requestFullscreen();
      } else if (body.msRequestFullscreen) {
        body.msRequestFullscreen();
      } else if (body.mozRequestFullScreen) {
        body.mozRequestFullScreen();
      } else if (body.webkitRequestFullscreen) {
        body.webkitRequestFullscreen();
      }
    }
  });
