/// <reference path="icase.ts" />

module Page {
  export class Case implements ICase {
    private _caseId: string;
    private _page: IPage;

    type = CaseType.Undefined;

    selected: boolean = false;
    correct: boolean = false;
    incorrect: boolean = false;

    result: number = 0;

    get id(): string {
      return this._caseId;
    }

    set id(caseId: string) {
      this._caseId = caseId;
    }

    get page(): IPage {
      return this._page;
    }

    constructor(page: IPage, data) {
      this._caseId = data._id;
      this._page = page;
    }

    /**
     * Method used to inform if the correct or incorrect indicator should be shown. Combine with ngIf or ngShow.
     * Indicator is shown when the page's settinsg allows so and (1) the answer is selected or (2) the questions is
     * answered and the case is correct.
     * @returns {boolean} Should the indicator be shown?
     */
    shouldShowIndicator(): boolean {
      return this._page.settings.showCorrectAnswer && (this.selected || (this._page.filled && this.correct));
    }

    /**
     * Informs if the results should be shown (when the page is filled and set to do so).
     * @returns {boolean} Should result be shown.
     */
    shouldShowResults(): boolean {
      return this._page.settings.showResults && this._page.filled;
    }

    /**
     * Method created mostly to mislead programmer making him think this is how the answer is sent. Too bad!
     * You've been goofed! The real sending is done in subclasses.
     * @returns {IPromise<T>}
     */
    send(): ng.IPromise<IPageSent> {
      var deferred = Bootstrap.$q.defer();
      deferred.resolve(<IPageSent>{});
      return deferred.promise;
    }

    makeSend(data: API.IQuizQuestionAnswer): ng.IPromise<API.IQuizQuestionAnswer> {
      var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.pageResponseUrl;
          url = url.replace(':pageId', this.page.id);

      if (Bootstrap.mode !== Engageform.Mode.Default) {
        url += '?preview';
      }

      data.quizQuestionId = this.page.id;
      data.userIdent = Bootstrap.user.sessionId;

      return Bootstrap.$http.post(url, data).then((res: API.IQuizQuestionAnswerResponse) => {
        if ([200, 304].indexOf(res.status) !== -1) {
          if (!data.userIdent) {
            Bootstrap.user.sessionId = res.data.userIdent;
          }
          return res.data;
        } else {
          return Bootstrap.$q.reject(res.data || {});
        }
      }).catch((res: API.IQuizQuestionAnswerResponse) => {
        return Bootstrap.$q.reject(res.data || {});
      });
    }

    load(): IPageSent {
      return <IPageSent>Bootstrap.localStorage.get('page.' + this.page.id) || <IPageSent>{};
    }

    save(data: IPageSent): void {
      Bootstrap.localStorage.set('page.' + this.page.id, data);
    }

    validate(): boolean {
      // "abstract"
      return true;
    }

    // Buzzer need extra send, so we made this abstract
    trueBuzzerSend(BCS: number) {
      // "abstract"
    }
  }
}
