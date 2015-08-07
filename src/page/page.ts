/// <reference path="ipage.ts" />
/// <reference path="ipages.ts" />
/// <reference path="ipagesent.ts" />

module Page {
  export class Page implements IPage {
    private _pageId: string;
    private _engageform: Engageform.IEngageform;

    type: Type;
    title: string;
    description: string;
    media: string;
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
        this.media = Util.Cloudinary.getInstance().prepareImageUrl(
          data.imageFile,
          680,
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
      deferred.resolve(sent);

      return deferred.promise;
    }

    selectAnswer(data): void {
      // "abstract"
    }

    private getMediaUrl(imageData, imageFile): string {
      if (!imageFile) {
        return '';
      }
      console.log(console);

      return
      //
      //if (imageFile.indexOf('http') === -1) {
      //  imageFile = Bootstrap.config.backend.api + Bootstrap.config.backend.imagesUrl + '/' + imageFile;
      //}
      //
      //return imageFile;
    }
  }
}
