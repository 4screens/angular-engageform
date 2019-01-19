'use strict';

angular.module('4screens.engageform').filter( 'nl2br', function( $sce ) {
  return function( message ) {
    return $sce.trustAsHtml(
      ( message + '' ).replace( /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2' )
    );
  };
});
