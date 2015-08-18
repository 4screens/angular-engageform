/// <reference path="imeta.ts" />

module Meta {
  export class Meta implements IMeta {
    private _engageform: Engageform.IEngageform;
    globalTitle: string = '';
    globalDescription: string = '';

    constructor(engageform: Engageform.IEngageform) {
      this._engageform = engageform;
      this.globalTitle = this._engageform.settings.share.title || '';
      this.globalDescription = this._engageform.settings.share.description || '';

      if (this._engageform.endPages.length < 1 || !_.find(this._engageform.pages, { social: true }) ) {
        if (this._engageform.startPages.length && this._engageform.pages[this._engageform.startPages[0]].title) {
          this.globalTitle = this._engageform.pages[this._engageform.startPages[0]].title;
          this.globalDescription = this._engageform.pages[this._engageform.startPages[0]].description;
        } else {
          this.globalTitle = '';
          this.globalDescription = '';
        }
      }
    }
  }
}
