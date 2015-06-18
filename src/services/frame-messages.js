angular.module('4screens.engageform').factory( 'message', function( $window ) {
  'use strict';
  return {
    send: function( name, data ) {
      $window.parent.postMessage( angular.extend( { name: name }, data ), '*' );
    },
    on: function( name, callback ) {
      // TODO
    }
  }
});
