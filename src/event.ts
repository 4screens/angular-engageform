interface IListenersDictionary {
  [index: string]: (() => void)[];
}

export default class Event {
  private _listener: IListenersDictionary = {}

  /**
   * Register callback for given event.
   *
   * @param {String} event
   * @param {Function} callback
   */
  listen(event: string, callback: () => void): void {
    if (!this._listener[event]) {
      this._listener[event] = []
    }
    this._listener[event].push(callback)
  }

  /**
   * Fire event with given arguments.
   *
   * @param {string} event Event's name.
   * @param {...data} data Values passed to the even handler.
   */
  trigger<T>(event: string, ...data: T[]): void {
    const listeners = this._listener[event]
    if (listeners) {
      listeners.forEach(listener => listener.apply(listener, data as []))
    }
  }
}
