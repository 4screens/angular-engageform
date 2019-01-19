'use strict';
angular.module('4screens.engageform')
  .factory( 'openInFullscreen', function( $document, message ) {
    var body = $document[0].body;

    return function() {
      if (body.requestFullscreen) {
        body.requestFullscreen();
        message.send('opened-in-fullscreen');
      } else if (body.msRequestFullscreen) {
        body.msRequestFullscreen();
        message.send('opened-in-fullscreen');
      } else if (body.mozRequestFullScreen) {
        body.mozRequestFullScreen();
        message.send('opened-in-fullscreen');
      } else if (body.webkitRequestFullscreen) {
        body.webkitRequestFullscreen();
        message.send('opened-in-fullscreen');
      } else {
        message.send('request-fullscreen');
      }
    }
  });
