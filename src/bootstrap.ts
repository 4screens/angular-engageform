/// <reference path="api/api.ts" />
/// <reference path="engageform/engageform.ts" />
/// <reference path="navigation/navigation.ts" />
/// <reference path="page/page.ts" />
/// <reference path="user/user.ts" />

class Bootstrap {
  static $http: ng.IHttpService;
  static $q: ng.IQService;
  static localStorage: ng.local.storage.ILocalStorageService;
  static user: User;
  static config;
  static mode = Engageform.Mode.Undefined;

  private _engageform: Engageform.IEngageform;

  constructor($http: ng.IHttpService, $q: ng.IQService, localStorage: ng.local.storage.ILocalStorageService, ApiConfig) {
    Bootstrap.$http = $http;
    Bootstrap.$q = $q;
    Bootstrap.localStorage = localStorage;
    Bootstrap.config = ApiConfig;
    Bootstrap.user = new User();
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

  get settings(): Engageform.ISetting {
    if (this._engageform) {
      return this._engageform.settings;
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

  get message(): string {
    if (this._engageform) {
      return this._engageform.message;
    }
  }

  init(opts: API.IEmbed): void {
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
      default:
        Bootstrap.mode = Engageform.Mode.Default;
    }

    Engageform.Engageform.getById(opts.id).then((engageform) => {
      switch (engageform.type) {
        case 'outcome':
          this._engageform = new Engageform.Outcome(engageform);
          break;
        case 'poll':
          this._engageform = new Engageform.Poll(engageform);
          break;
        case 'score':
          this._engageform = new Engageform.Score(engageform);
          break;
        case 'survey':
          this._engageform = new Engageform.Survey(engageform);
          break;
      }
    });
  }
}

Bootstrap.$inject = ['$http', '$q', 'localStorageService', 'ApiConfig'];
app.service('Engageform', Bootstrap);
