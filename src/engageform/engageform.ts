/// <reference path="iengageform.ts" />

module Engageform {
  export class Engageform implements IEngageform {
    private _engageformId: string;
    private _pages: Page.IPages = {};

    private _startPages: string[] = [];
    private _endPages: string[] = [];
    private _availablePages: string[] = [];

    type: Type = Type.Undefined;
    title;
    message;
    settings;
    theme;

    current: Page.IPage;
    navigation: Navigation.INavigation;

    get pages(): Page.IPages {
      return this._pages;
    }

    get startPages(): string[] {
      return this._startPages;
    }

    get endPages(): string[] {
      return this._endPages;
    }

    get availablePages(): string[] {
      return this._availablePages;
    }

    constructor(data: API.IQuiz) {
      this._engageformId = data._id;

      this.title = data.title;
      this.settings = new Settings(data);
      this.theme = new Theme(data);
    }

    initPages(): ng.IPromise<IEngageform> {
      return this.getPagesById(this._engageformId).then((pages) => {
        pages.map((page) => {
          switch (page.type) {
            case 'multiChoice':
              this._availablePages.push(page._id);
              this._pages[page._id] = new Page.MultiChoice(<IEngageform>this, page);
              break;
            case 'pictureChoice':
              this._availablePages.push(page._id);
              this._pages[page._id] = new Page.PictureChoice(<IEngageform>this, page);
              break;
            case 'rateIt':
              this._availablePages.push(page._id);
              this._pages[page._id] = new Page.Rateit(<IEngageform>this, page);
              break;
            case 'forms':
              this._availablePages.push(page._id);
              this._pages[page._id] = new Page.Form(<IEngageform>this, page);
              break;
            case 'startPage':
              this._startPages.push(page._id);
              this._pages[page._id] = new Page.StartPage(<IEngageform>this, page);
              break;
            case 'endPage':
              this._endPages.push(page._id);
              this._pages[page._id] = new Page.EndPage(<IEngageform>this, page);
              break;
          }
        });

        return <IEngageform>this;
      });
    }

    setCurrent(pageId: string) {
      this.current = this._pages[pageId];
    }

    setCurrentEndPage(): ng.IPromise<API.IQuizFinish> {
      var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.engageformFinishUrl;
          url = url.replace(':engageformId', this._engageformId);

      if (Bootstrap.mode !== Mode.Default) {
        url += '?preview';
      }

      return Bootstrap.$http.post(url, {
        userIdent: Bootstrap.user.sessionId,
        globalUserIdent: Bootstrap.user.id
      }).then(function (res: API.IQuizFinishResponse) {
        if ([200, 304].indexOf(res.status) !== -1) {
          Bootstrap.localStorage.clearAll();
          Bootstrap.user.id = res.data.globalUserIdent;
          return res.data;
        }

        this.$q.reject(res);
      });
    }

    static getById(id: string): ng.IPromise<API.IQuiz> {
      var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.engageformUrl;
      url = url.replace(':engageformId', id);

      if (Bootstrap.mode !== Mode.Default) {
        url += '?preview';
      }

      return Bootstrap.$http.get(url).then((res: API.IQuizResponse) => {
        if ([200, 304].indexOf(res.status) !== -1) {
          return res.data;
        }

        return Bootstrap.$q.reject(res);
      });
    }

    private getPagesById(engageformId: string): ng.IPromise<API.IQuizQuestion[]> {
      var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.engageformPagesUrl;
          url = url.replace(':engageformId', this._engageformId);

      if (Bootstrap.mode !== Mode.Default) {
        url += '?preview';
      }

      return Bootstrap.$http.get(url.replace(':engageformId', engageformId)).then(function (res) {
        if ([200, 304].indexOf(res.status) !== -1) {
          return res.data;
        }

        this.$q.reject(res);
      });
    }
  }
}
