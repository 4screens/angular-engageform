/// <reference path="api/api.ts" />
/// <reference path="engageform/engageform.ts" />
/// <reference path="navigation/navigation.ts" />
/// <reference path="meta/meta.ts" />
/// <reference path="page/page.ts" />
/// <reference path="user/user.ts" />
/// <reference path="util/event.ts" />

import IPromise = angular.IPromise;

class Bootstrap {
  static $http: ng.IHttpService;
  static $q: ng.IQService;
  static $timeout: ng.ITimeoutService;
  static cloudinary: any;
  static localStorage: ng.local.storage.ILocalStorageService;
  static user: User;
  static config;
  static mode = Engageform.Mode.Undefined;
  Engageform: Engageform.IEngageform;

  private _engageform: Engageform.IEngageform;
  private _event: Util.Event;

  private static _instances: Engageform.IEngageformInstances = {};

  // Stores the constructors of quizzes mapped by names. Values are assigned in constructor because the modules
  // dependency is spaghetti-like and constructors will be undefined at this point.
  static quizzesConstructors;

  constructor($http: ng.IHttpService, $q: ng.IQService, $timeout: ng.ITimeoutService, cloudinary: any,
              localStorage: ng.local.storage.ILocalStorageService, ApiConfig: Config.ApiConfig) {
    Bootstrap.$http = $http;
    Bootstrap.$q = $q;
    Bootstrap.$timeout = $timeout;
    Bootstrap.cloudinary = cloudinary;
    Bootstrap.localStorage = localStorage;
    Bootstrap.config = ApiConfig;
    Bootstrap.user = new User();

    // Map names to constructors.
    Bootstrap.quizzesConstructors = {
      outcome: Engageform.Outcome,
      poll: Engageform.Poll,
      score: Engageform.Score,
      survey: Engageform.Survey,
      live: Engageform.Live
    };

    // FIXME: This is inaccessible inside the library, since it's the consumer app that creates the instance so it
    // isn't possible to actually trigger any event! I'm leaving it here because I don't care enough to check
    // if any app tries to subscribe for this event. I'm almost sure it's safe to remove, though.
    this._event = new Util.Event();

    Bootstrap.cloudinary.setConfig(ApiConfig.cloudinary);
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
        sendAnswerCallback: function() {}
      };
    } else if (!opts.callback.sendAnswerCallback) {
      opts.callback.sendAnswerCallback = function() {};
    }

    // Initialize the quiz.
    return Bootstrap.$q.all({
      quizData: Engageform.Engageform.getById(opts.id),
      pages: Engageform.Engageform.getPagesById(opts.id)
    }).then((data: API.IQuizAndPagesInit) => {
      // If the quiz doesn't have a supported constructor, reject the promise with error.
      if (!Bootstrap.quizzesConstructors[data.quizData.type]) {
        return Bootstrap.$q.reject({
          status: 'error',
          error: {
            code: 406,
            message: 'Type property not supported.'
          },
          data: data.quizData
        });
      }

      // Create the Engageform's instance.
      this._engageform = new Bootstrap.quizzesConstructors[data.quizData.type](data.quizData, data.pages,
        opts.callback.sendAnswerCallback);

      return this._engageform;
    });
  }

  destroyInstances() {
    Bootstrap._instances = {};
  }
}

Bootstrap.$inject = ['$http', '$q', '$timeout', 'cloudinary', 'localStorageService', 'ApiConfig'];
app.service('Engageform', Bootstrap);
