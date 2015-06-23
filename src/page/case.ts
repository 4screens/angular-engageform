/// <reference path="icase.ts" />

module Page {
  export class Case implements ICase {
    private _caseId: string;
    private _page: IPage;

    type = CaseType.Undefined;

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

    send(): ng.IPromise<IPageSent> {
      var deferred = Bootstrap.$q.defer();
      deferred.resolve(<IPageSent>{});
      return deferred.promise;
    }

    makeSend(data: API.IQuizQuestionAnswer): ng.IPromise<API.IQuizQuestionAnswer> {
      // @todo move url to the configuration
      var url = 'http://answers.4screens.acc.nopattern.net/api/v1/quiz/question/:pageId/response';

      data.quizQuestionId = this.page.id;
      data.userIdent = Bootstrap.user.sessionId;

      return Bootstrap.$http.post(url.replace(':pageId', this.page.id), data).then((res: API.IQuizQuestionAnswerResponse) => {
        if ([200, 304].indexOf(res.status) !== -1) {
          if (!data.userIdent) {
            Bootstrap.user.sessionId = res.data.userIdent;
          }
          return res.data;
        }

        return Bootstrap.$q.reject(res);
      });
    }

    load(): IPageSent {
      return <IPageSent>Bootstrap.localStorage.get('page.' + this.page.id) || <IPageSent>{};
    }

    save(data: IPageSent): void {
      Bootstrap.localStorage.set('page.' + this.page.id, data);
    }

    validate(): ng.IPromise<ICase> {
      // "abstract"
      var deferred = Bootstrap.$q.defer();
      deferred.resolve(<ICase>{});
      return deferred.promise;
    }
  }
}
