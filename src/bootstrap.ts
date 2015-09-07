/// <reference path="api/api.ts" />
/// <reference path="api/config.ts" />
/// <reference path="engageform/engageform.ts" />
/// <reference path="navigation/navigation.ts" />
/// <reference path="meta/meta.ts" />
/// <reference path="page/page.ts" />
/// <reference path="user/user.ts" />
/// <reference path="util/cloudinary.ts" />
/// <reference path="util/event.ts" />

class Bootstrap {
  static $http: ng.IHttpService;
  static $q: ng.IQService;
  static $timeout: ng.ITimeoutService;
  static localStorage: ng.local.storage.ILocalStorageService;
  static user: User;
  static config;
  static mode = Engageform.Mode.Undefined;
  Engageform: Engageform.IEngageform;

  private _engageform: Engageform.IEngageform;
  private _event: Util.Event;

  private static _instances: Engageform.IEngageformInstances = {};

  constructor($http: ng.IHttpService, $q: ng.IQService, $timeout: ng.ITimeoutService,
              localStorage: ng.local.storage.ILocalStorageService, ApiConfig: Config.ApiConfig) {
    Bootstrap.$http = $http;
    Bootstrap.$q = $q;
    Bootstrap.$timeout = $timeout;
    Bootstrap.localStorage = localStorage;
    Bootstrap.config = ApiConfig;
    Bootstrap.user = new User();

    this._event = new Util.Event();

    Util.Cloudinary.setConfig(<Util.CloudinaryConfig>ApiConfig.cloudinary);
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

  get meta(): Meta.IMeta {
    if (this._engageform) {
      return this._engageform.meta;
    }
  }

  get event(): Util.Event {
    if (this._event) {
      return this._event;
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

    console.log('[instances]', Bootstrap._instances);

    if (Bootstrap._instances[opts.id]) {
      return Bootstrap._instances[opts.id];
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

    if (!opts.callback) {
      opts.callback = {
          sendAnswerCallback: function() {
              return;
          }
      };
    } else if (!opts.callback.sendAnswerCallback) {
      opts.callback.sendAnswerCallback = function(){
        return;
      };
    }

    return Engageform.Engageform.getById(opts.id).then((engageformData) => {
      switch (engageformData.type) {
        case 'outcome':
          this._engageform = new Engageform.Outcome(engageformData, opts.callback.sendAnswerCallback);
          break;
        case 'poll':
          this._engageform = new Engageform.Poll(engageformData, opts.callback.sendAnswerCallback);
            break;
        case 'score':
          this._engageform = new Engageform.Score(engageformData, opts.callback.sendAnswerCallback);
          break;
        case 'survey':
          this._engageform = new Engageform.Survey(engageformData, opts.callback.sendAnswerCallback);
          break;
        case 'live':
          this._engageform = new Engageform.Live(engageformData, opts.callback.sendAnswerCallback);
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

      return Bootstrap._instances[opts.id] = this._engageform.initPages();
    }).then(function(engageform) {
      engageform.navigation = new Navigation.Navigation(<Engageform.IEngageform>engageform);
      engageform.meta = new Meta.Meta(<Engageform.IEngageform>engageform);
      return engageform;
    });
  }
}

Bootstrap.$inject = ['$http', '$q', '$timeout', 'localStorageService', 'ApiConfig'];
app.service('Engageform', Bootstrap);
