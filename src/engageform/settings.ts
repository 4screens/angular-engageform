/// <reference path="isettings.ts" />

module Engageform {
  export class Settings implements ISetting {
    allowAnswerChange: boolean = false;

    constructor(data: API.IQuiz) {
      if (data.settings) {
        this.allowAnswerChange = !!data.settings.allowAnswerChange;
      }
    }
  }
}
