'use strict';

angular.module('4screens.engageform').filter( 'questionsFilter', function () {
  return function ( a ) {
    var A = a;
    angular.forEach( A, function ( e, i, _a ) {
      if (e.type == 'startPage' && i !== 0) {
        A.unshift( A.splice( i, 1 )[0] );
      }
    });
    return A;
  };
})