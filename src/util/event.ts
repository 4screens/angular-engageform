module Util {
  export interface IEvent {
    listen(event: string, callback: any): void;
    trigger(event: string, ...data: any[]): void;
  }

  export interface IListenersDictionary {
    [index: string]: IListener[];
  }

  export interface IListener {
    (): void;
  }

  export class Event implements IEvent {
    private _listener: IListenersDictionary = {};

    /**
     * Register callback for given event.
     *
     * @param {String} event
     * @param {Function} callback
     */
    listen(event: string, callback: IListener): void {
      if (!this._listener[event]) {
        this._listener[event] = [];
      }

      this._listener[event].push(callback);

    }

    /**
     * Fire event with given arguments.
     *
     * @param {string} event
     * @param {args...} data
     */
    trigger(event: string, ...data: any[]): void {
      var args = Array.apply(null, arguments).slice(1);
      var listeners = this._listener[event];

      if (!listeners) {
        return;
      }

      for (var i = 0; i < listeners.length; i++) {
        listeners[i].apply(null, args);
      }
    }
  }
}
