/// <reference path="api/api.ts" />
/// <reference path="engageform/engageform.ts" />
/// <reference path="navigation/navigation.ts" />
/// <reference path="page/page.ts" />
/// <reference path="user/user.ts" />
/// <reference path="util/cloudinary.ts" />
/// <reference path="util/events.ts" />

class Bootstrap {
  static $http: ng.IHttpService;
  static $q: ng.IQService;
  static $timeout: ng.ITimeoutService;
  static localStorage: ng.local.storage.ILocalStorageService;
  static user: User;
  static config;
  static mode = Engageform.Mode.Undefined;

  private _engageform: Engageform.IEngageform;
  private _cloudinary: Util.Cloudinary;
  private _events: Util.Events;

  constructor($http: ng.IHttpService, $q: ng.IQService, $timeout: ng.ITimeoutService,
              localStorage: ng.local.storage.ILocalStorageService, ApiConfig) {
    Bootstrap.$http = $http;
    Bootstrap.$q = $q;
    Bootstrap.$timeout = $timeout;
    Bootstrap.localStorage = localStorage;
    Bootstrap.config = ApiConfig;
    Bootstrap.user = new User();

    this._cloudinary = new Util.Cloudinary();
    this._events = new Util.Events();
  }

  get type(): Engageform.Type {
    if (this._engageform) {
      return this._engageform.type;
    }

    return Engageform.Type.Undefined;
  }

  get Type() {
    return Engageform.Type;
  }

  get mode(): Engageform.Mode {
    return Bootstrap.mode;
  }

  get Mode() {
    return Engageform.Mode;
  }

  get title(): string {
    if (this._engageform) {
      return this._engageform.title;
    }
  }

  get theme(): Engageform.ITheme {
    if (this._engageform) {
      return this._engageform.theme;
    }
  }

  get current(): Page.IPage {
    if (this._engageform) {
      return this._engageform.current;
    }
  }

  get navigation(): Navigation.INavigation {
    if (this._engageform) {
      return this._engageform.navigation;
    }
  }

  get branding(): Branding.IBranding {
    if (this._engageform) {
      return this._engageform.branding;
    }
  }

  get message(): string {
    if (this._engageform) {
      return this._engageform.message;
    }
  }

  get events(): Util.Events {
    if (this._events) {
      return this._events;
    }
  }

  init(opts: API.IEmbed): ng.IPromise<Engageform.IEngageform> {
    if (!opts || !opts.id) {
      return Bootstrap.$q.reject({
        status: 'error',
        error: {
          code: 406,
          message: 'The required id property does not exist.'
        },
        data: opts
      });
    }

    switch (opts.mode) {
      case 'preview':
        Bootstrap.mode = Engageform.Mode.Preview;
        break;
      case 'summary':
        Bootstrap.mode = Engageform.Mode.Summary;
        break;
      case 'result':
        Bootstrap.mode = Engageform.Mode.Result;
        break;
      case 'default':
      case '':
      case undefined:
        Bootstrap.mode = Engageform.Mode.Default;
        break;
      default:
        return Bootstrap.$q.reject({
          status: 'error',
          error: {
            code: 406,
            message: 'Mode property not supported.'
          },
          data: opts
        });
    }

    return Engageform.Engageform.getById(opts.id).then((engageformData) => {
      switch (engageformData.type) {
        case 'outcome':
          this._engageform = new Engageform.Outcome(engageformData);
          break;
        case 'poll':
          this._engageform = new Engageform.Poll(engageformData);
          break;
        case 'score':
          this._engageform = new Engageform.Score(engageformData);
          break;
        case 'survey':
          this._engageform = new Engageform.Survey(engageformData);
          break;
        case 'live':
          this._engageform = new Engageform.Live(engageformData);
          break;
        default:
          return Bootstrap.$q.reject({
            status: 'error',
            error: {
              code: 406,
              message: 'Type property not supported.'
            },
            data: engageformData
          });
      }
      return this._engageform.initPages();
    }).then(function(engageform) {
      engageform.navigation = new Navigation.Navigation(<Engageform.IEngageform>engageform);
      return engageform;
    });
  }
}

Bootstrap.$inject = ['$http', '$q', '$timeout', 'localStorageService', 'ApiConfig'];
app.service('Engageform', Bootstrap);
