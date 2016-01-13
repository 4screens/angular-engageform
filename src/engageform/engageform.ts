/// <reference path="iengageform.ts" />
/// <reference path="isendanswercallback.ts" />

module Engageform {
  export class Engageform implements IEngageform {
    private _engageformId: string;
    private _pages: Page.IPages = {};

    private _startPages: string[] = [];
    private _endPages: string[] = [];
    private _availablePages: string[] = [];
    private _hasForms: boolean = false;

    public sendAnswerCallback: ISendAnswerCallback;

    enabled: boolean = true;
    type: Type = Type.Undefined;
    title: string;
    message: string;
    settings: Settings;
    theme: Theme;
    branding: Branding.Branding;
    tabs: Tabs;

    current: Page.IPage;
    navigation: Navigation.INavigation;
    meta: Meta.IMeta;

    event: Util.Event;

    mode: Engageform.Mode;

    get id(): string {
      return this._engageformId;
    }

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

    get typeName(): string {
      return Type[this.type].toLowerCase();
    }

    /**
     * @public
     * @description
     * Returns boolean information about the presence of form-type in the current engageform.
     *
     * @returns {boolean} Are there any form-type questions?
     */
    get hasForms(): boolean {
      return this._hasForms;
    }

    /**
     * @public
     * @description
     * Checks if the current engageform is of provided type. Takes Types enum as an argument.
     *
     * @param {Type} type Engageform type from the Type enum.
     * @returns {boolean} Is it?
     */
    isType(type: Type): boolean {
      return this.type === type;
    }

    constructor(data: API.IQuiz, pages: API.IPages, mode: Engageform.Mode,
                sendAnswerCallback: ISendAnswerCallback = () => {}) {
      this._engageformId = data._id;
      this.mode = mode;

      this.sendAnswerCallback = sendAnswerCallback;

      this.title = data.title;
      this.settings = new Settings(data);
      this.theme = new Theme(data);
      this.tabs = new Tabs(data);

      this.event = new Util.Event();

      if (data.settings && data.settings.branding) {
        this.branding = new Branding.Branding(data.settings.branding);
      } else {
        this.branding = new Branding.Branding({});
      }

      this.buildPages(pages);

      this.navigation = new Navigation.Navigation(this);
      this.meta = new Meta.Meta(this);
    }

    initPage(page: API.IQuiz) {
      // ..Abstract for liveEvent
    }

    setCurrent(pageId: string) {
      this.current = <Page.IPage>this._pages[pageId];
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

        return this.$q.reject(res);
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

    cleanPages(): void {
      this._availablePages.length = 0;
      this._pages = {};
    }

    buildPages(pages: API.IPages): void {
      pages.map((page: API.IQuizQuestion) => {
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
            // Store information about this engageform having a form-type question.
            this._hasForms = true;

            this._availablePages.push(page._id);
            this._pages[page._id] = new Page.Form(<IEngageform>this, page);
            break;
          case 'startPage':
            this._startPages.push(page._id);
            this._pages[page._id] = new Page.StartPage(<IEngageform>this, page);
            break;
          case 'endPage':
            this._endPages.push(page._id);
            this._pages[page._id] = new Page.EndPage(<IEngageform>this, page, this.settings);
            break;

          // EngageNow exclusive page types
          case 'buzzer':
            this._availablePages.push(page._id);
            this._pages[page._id] = new Page.Buzzer(<IEngageform>this, page);
            break;
          case 'poster':
            this._availablePages.push(page._id);
            this._pages[page._id] = new Page.Poster(<IEngageform>this, page);
            break;
        }
      });
    }

    static getPagesById(engageformId: string): ng.IPromise<API.IQuizQuestion[]> {
      var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.engageformPagesUrl;
          url = url.replace(':engageformId', engageformId);

      if (Bootstrap.mode !== Mode.Default) {
        url += '?preview';
      }
      return Bootstrap.$http.get(url).then(function (res) {
        if ([200, 304].indexOf(res.status) !== -1) {
          return res.data;
        }

        this.$q.reject(res);
      });
    }
  }
}
