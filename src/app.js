'use strict';

angular.module( '4screens.engageform',[
  '4screens.common',
  '4screens.settings',
  'LocalStorageModule',
  'youtube-embed'
]).config(function( localStorageServiceProvider ) {
  // localStorageService
  localStorageServiceProvider.prefix = '4screens.engageform';
});
