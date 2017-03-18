/// <reference path="api/api.ts" />
/// <reference path="navigation/navigation.ts" />
/// <reference path="meta/meta.ts" />
/// <reference path="page/page.ts" />
/// <reference path="user/user.ts" />
/// <reference path="util/event.ts" />
/// <reference path="engageform/engageform.ts" />

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

  // Modes the library can operates in. Values assigned later due to the spaghetti.
  static modes;

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

    Bootstrap.modes = {
      preview: Engageform.Mode.Preview,
      summary: Engageform.Mode.Summary,
      results: Engageform.Mode.Result,
      'default': Engageform.Mode.Default,
      '': Engageform.Mode.Default
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
    // Options are required and need to have a quiz ID.
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

    // Return already initialised instance if already exists.
    if (Bootstrap._instances[opts.id]) {
      return Bootstrap._instances[opts.id];
    }

    // When mode is not provided, set id to default.
    if (typeof opts.mode === 'undefined') {
      opts.mode = 'default';
    }

    // If the requested mode is not supported, reject the initialisation.
    if (!Bootstrap.modes[opts.mode]) {
      return Bootstrap.$q.reject({
        status: 'error',
        error: {
          code: 406,
          message: 'Mode property not supported.'
        },
        data: opts
      });
    }

    // Set the mode in which the whole library operates.
    Bootstrap.mode = Bootstrap.modes[opts.mode];

    // Create the promises map that will have to resolve before the quiz is initialised.
    let initializationPromises: { [index: string]: any; quizData: ng.IPromise<API.IQuiz>; pages?: ng.IPromise<API.IPages> } = {
      quizData: Bootstrap.getData('quiz', opts.id)
    };

    // If the quiz is not live get the pages before initialising it.
    if (!opts.live) {
      initializationPromises.pages = Bootstrap.getData('pages', opts.id);
    }

    // Initialize the quiz.
    return Bootstrap.$q.all(initializationPromises).then((data: API.IQuizAndPagesInit) => {
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
      this._engageform = new Bootstrap.quizzesConstructors[data.quizData.type](data.quizData,
        Bootstrap.mode, data.pages, opts.embedSettings, opts.callback ? opts.callback.sendAnswerCallback : () => {
        });

      return this._engageform;
    });
  }

  /**
   * Fetches the two types of data from the API: quiz data and pages data.
   * @param type Resource type: quiz or pages.
   * @param id ID of the quiz.
   * @returns {IPromise<API.IQuizQuestion[]|API.IQuiz>}
   */
  static getData(type: string, id: string): ng.IPromise<API.IQuizQuestion[] | API.IQuiz> {
    const resourcesPaths = {
      quiz: 'engageformUrl',
      pages: 'engageformPagesUrl'
    };

    // Basic validation.
    if (!resourcesPaths[type]) {
      throw new Error(`Resource path for ${type} type of data is unknown.`);
    }

    // Decide the data URL depending on the type.
    let url = Bootstrap.config.backend.domain +
      Bootstrap.config.engageform[type === 'quiz' ? 'engageformUrl' : 'engageformPagesUrl'];

    // Valid ID required.
    url = url.replace(':engageformId', id);

    // Inform the backend it shouldn't store statistics when a quiz is not in a default mode.
    if (Bootstrap.mode !== Engageform.Mode.Default) {
      url += '?preview';
    }

    // Go, fetch the data.
    return Bootstrap.$http.get(url).then(function (res) {
      if ([200, 304].indexOf(res.status) !== -1) {
        return res.data;
      }

      Bootstrap.$q.reject(res);
    });
  }

  destroyInstances() {
    Bootstrap._instances = {};
  }
}

Bootstrap.$inject = ['$http', '$q', '$timeout', 'cloudinary', 'localStorageService', 'ApiConfig'];
app.service('Engageform', Bootstrap);
