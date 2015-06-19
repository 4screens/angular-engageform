/// <reference path="ipage.ts" />
/// <reference path="ipages.ts" />
/// <reference path="ipagesent.ts" />

module Page {
  export class Page implements IPage {
    private _pageId:string;
    private _engageform: Engageform.IEngageform;

    type: Type;
    title: string;
    filled: boolean;
    settings: ISetting;
    cases: ICase[] = [];

    get id(): string {
      return this._pageId;
    }

    get engageform(): Engageform.IEngageform {
      return this._engageform;
    }

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      this._pageId = data._id;
      this._engageform = engageform;

      this.title = data.text;
      this.settings = <ISetting>new Settings(data);
    }

    send(): void {}
    selectAnswer(data): void {}
  }
}
