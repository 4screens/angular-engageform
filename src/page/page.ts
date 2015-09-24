/// <reference path="ipage.ts" />
/// <reference path="ipages.ts" />
/// <reference path="ipagesent.ts" />

module Page {
  export class Page implements IPage {
    private _pageId: string;
    private _engageform: Engageform.IEngageform;

    type: Type;
    title: string = '';
    description: string = '';
    media: string = '';
    filled: boolean;
    settings: ISetting;
    cases: ICase[] = [];

    get id(): string {
      return this._pageId;
    }

    get engageform(): Engageform.IEngageform {
      return this._engageform;
    }

    get Type() {
      return Type;
    }

    get CaseType() {
      return CaseType;
    }

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      this._pageId = data._id;
      this._engageform = engageform;

      this.settings = <ISetting>new Settings(data);
      this.title = data.text || '';

      if (this.settings.showDescription) {
        this.description = data.description || '';
      }
      if (this.settings.showMainMedia) {
        this.media = Bootstrap.cloudinary.prepareImageUrl(
          data.imageFile,
          680, // zakładamy że media zawsze ma taką szerokość (MUST BE FIXXXXXED!!!!!)
          data.imageData
        );
      }
    }

    send(vcase: ICase): ng.IPromise<IPageSent> {
      if (this._engageform.enabled === false) {
        return Bootstrap.$q.reject('Engageform already ended.');
      }

      if (vcase) {
        return vcase.send();
      }

      var deferred = Bootstrap.$q.defer();
      deferred.resolve();
      return deferred.promise;
    }

    sent(): ng.IPromise<IPageSent> {
      var deferred = Bootstrap.$q.defer();
      var sent = <IPageSent>{};

      switch (Bootstrap.mode) {
        default:
          sent = <IPageSent>(Bootstrap.localStorage.get('page.' + this.id) || {});
          break;
      }

      if (this.settings.showResults && sent.results) {
        this.getStatsById(this.id).then((data: API.IQuizQuestion) => {
          deferred.resolve(this.refreshAnswer(sent, data));
        }).catch(() => {
          deferred.resolve(sent);
        });
      } else {
        deferred.resolve(sent);
      }

      return deferred.promise;
    }

    refreshAnswer(sent: IPageSent, question: API.IQuizQuestion): IPageSent {
      // "abstract"
      return sent;
    }

    selectAnswer(data): void {
      // "abstract"
    }

    updateAnswers(data): void {
      if (this.id !== data.questionId) {
        return;
      }

      if (this.engageform.current && !_.isUndefined(data.avg)) {
        this.engageform.current.result = data.avg;
      }

      Bootstrap.$timeout(() => {
        this.cases.map((vcase: ICase) => {
          if (!_.isUndefined(data[vcase.id])) {
            var loaded = vcase.load();
            if (loaded.results) {
              loaded.results[vcase.id] = data[vcase.id];
              vcase.save(loaded);
              vcase.result = data[vcase.id] || 0;
            }
          }
        });
      });
    }

    private getStatsById(pageId): ng.IPromise<API.IQuizQuestion> {
      var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.pageStatsUrl;
      url = url.replace(':pageId', pageId);

      return Bootstrap.$http.get(url).then((res) => {
        if ([200, 304].indexOf(res.status) !== -1) {
          return res.data;
        }

        return Bootstrap.$q.reject(res);
      });
    }

  }
}
