module Events {
  import IListeners = Events.IListeners;
  export interface IEvents {
    listen(name: string, callback: (data?: Object)=>void): void;
    trigger(name: string, data: Object): void;
  }

  export interface IListenersDictionary {
    [index:string]: IListeners[];
  }

  export interface IListeners {
    [index:number]: IListener[];
  }

  export interface IListener {
    (data?:Object): void;
  }

  export class Events implements IEvents {
    private listeners:IListenersDictionary = {};

    listen(name: string, callback: Function):void {
      if (!this.listeners[name]) {
        this.listeners[name] = [];
      }

      this.listeners[name].push(callback);
    }

    trigger(name:string, data?:Object = {}):void {
      if (this.listeners[name]) {
        for (var i = 0; i < this.listeners[name].length; i += 1) {
          this.listeners[name][i](data);
        }
      }
    }
  }
}
