/// <reference path="api/api.ts" />
/// <reference path="engageform/engageform.ts" />
/// <reference path="navigation/navigation.ts" />
/// <reference path="page/page.ts" />
/// <reference path="user/user.ts" />

class Bootstrap {
  static $http: ng.IHttpService;
  static $q: ng.IQService;
  static localStorage;
  static user: User;

  private _engageform: Engageform.IEngageform;

  constructor($http: ng.IHttpService, $q: ng.IQService, localStorage) {
    Bootstrap.$http = $http;
    Bootstrap.$q = $q;
    Bootstrap.localStorage = localStorage;
    Bootstrap.user = new User();
  }

  get type(): Engageform.Type {
    if (this._engageform) {
      return this._engageform.type;
    }

    return Engageform.Type.Undefined;
  }

  get mode(): Engageform.Mode {
    if (this._engageform) {
      return this._engageform.mode;
    }

    return Engageform.Mode.Undefined;
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
    this.getById(opts.id).then((engageform) => {
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

  private getById(id: string): ng.IPromise<API.IQuiz> {
    var url = 'http://answers.4screens.acc.nopattern.net/api/v1/quiz/:quizId'.replace(':quizId', id);

    return Bootstrap.$http.get(url).then((res: API.IQuizResponse) => {
      if ([200, 304].indexOf(res.status) !== -1) {
        return res.data;
      }

      return Bootstrap.$q.reject(res);
    });
  }
}

Bootstrap.$inject = ['$http', '$q', 'localStorageService'];
app.service('Engageform', Bootstrap);
