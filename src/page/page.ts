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
    mediaWidth: number;
    mediaHeight: number;
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

      if (this.settings.showMainMedia && data.imageData) {
        this.media = Bootstrap.cloudinary.prepareImageUrl(
          data.imageFile,
          680, // zakładamy że media zawsze ma taką szerokość (MUST BE FIXXXXXED!!!!!)
          data.imageData
        );
        this.mediaWidth = 680;
        if (data.imageData.containerRatio) {
          this.mediaHeight = Math.round(680 * data.imageData.containerRatio);
        } else {
          this.mediaHeight = Math.round(data.imageData.containerHeight || 0);
        }
      }
    }

    send(vcase: ICase): ng.IPromise<IPageSent> {
      if (this._engageform.enabled === false) {
        return Bootstrap.$q.reject('Engageform already ended.');
      }

      if (vcase) {
        return vcase.send();
      } else {
        let deferred = Bootstrap.$q.defer();
        deferred.resolve();
        return deferred.promise;
      }
    }

    sent(): ng.IPromise<IPageSent> {
      var deferred = Bootstrap.$q.defer();
      var sent = <IPageSent>{};

      sent = <IPageSent>(Bootstrap.localStorage.get('page.' + this.id) || {});

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

    createCase(data, symbol?): void|ICase {
      // "abstract
      return;
    }

    /**
     * Sets the provided results on the page's cases.
     * @param results Object containing data with results that should be set on the cases.
     */
    setResults(results: API.Result) {
      let casesWithResults = this.cases.map((singleCase: ICase) => {
        // Set's the result on the case. Side effect, but makes the whole method a bit faster. Otherwise there
        // would be a need for more loops when creating fake answers.
        singleCase.result = Number(results.stats[singleCase.id]) || 0;

        // Returns the ID of the case so there's no need to loop them later
        return singleCase.id;
      });

      // Create fake cases when there's a result but no answer for that.
      for (let k in results.stats) {
        if (casesWithResults.indexOf(k) === -1
          // There's the questionId in the API…
          && k !== 'questionId'

          // Don't create the case for rateits.
          && this.type !== Type.Rateit) {

          // Create the fake answer to show results…
          let fakeCase: ICase = <ICase>this.createCase({
            text: '[Removed answer]',
            _id: k,
            imageData: {
              // Comes from the backend by default.
              height: 100
            }
          });

          // … and set those results…
          fakeCase.result = Number(results.stats[fakeCase.id]);

          // … and add them to the answers pool.
          this.cases.push(fakeCase);
        }
      }
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
            }

            vcase.result = data[vcase.id] || 0;
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
