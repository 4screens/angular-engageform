angular.module('4screens.engageform').factory( 'message', function( $window ) {
  'use strict';

  // Callbacks store.
  var eventsCallbacks = {};

  /**
   * Registers a callback that will be executed when the postMessage with the registered name will come.
   * @param {string} name Message's name (the 'name' property of the event.data object).
   * @param {function} callback Function that will be called with event's data and event object as argumetns.
   */
  function registerCallback( name, callback ) {
    if ( typeof callback !== 'function' ) {
      throw new Error( 'Provide a function as a callback' );
    }

    // Create callbacks list for a given name.
    if ( !eventsCallbacks[name] ) {
      eventsCallbacks[name] = [];
    }

    // Add the callback if it is not yet registered.
    if ( eventsCallbacks[name].indexOf( callback ) === -1 ) {
      eventsCallbacks[name].push( callback );
    }
  }

  /**
   * Deregisters a single callback, when the reference is provided as a second argument or removes all callbacks otherwise.
   * @param {string} name Event's name on which the callback listens.
   * @param {function} callback (optional) The reference to the callback.
   * @returns {boolean} Was the callback deregistered?
   */
  function deregisterCallback( name, callback ) {
    // Don't do anything if there's no listeners.
    if (!eventsCallbacks[name]) {
      return false;
    }

    // If there's callback provided, remove it from the listeners.
    if (callback) {
      eventsCallbacks[name].splice( eventsCallbacks[name].indexOf( callback ), 1 );

    // Otherwise remove all listeners.
    } else {
      eventsCallbacks[name].lenght = 0;
    }

    return true;
  }

  /**
   * Fires the callback registered under a specified name. Provides the functions a the data and an event object.
   * @param {string} name Event's name.
   * @param {eventObject} event The event object coming from the message listener.
   */
  function fireCallbacks( name, event ) {
    if ( eventsCallbacks[name] ) {
      for ( var i = 0; i < eventsCallbacks[name].length; i += 1 ) {
        eventsCallbacks[name][i]( event.data || {}, event )
      }
    }
  }

  // Register the main message listener that will proxy the data to callbacks.
  $window.addEventListener( 'message', function( event ) {
    if (event.data && event.data.name) {
      fireCallbacks( event.data.name, event );
    }
  } );

  return {
    send: function( name, data ) {
      $window.parent.postMessage( angular.extend( { name: name }, data ), '*' );
    },
    on: registerCallback,
    off: deregisterCallback
  }
});
