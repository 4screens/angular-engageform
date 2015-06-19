/// <reference path="isettings.ts" />

module Page {
  export class Settings implements ISetting {
    showAnswers: boolean = false;
    showCorrectAnswer: boolean = false;
    showMainMedia: boolean = false;
    showDescription: boolean = false;
    requiredAnswer: boolean = false;

    constructor(data: API.IQuizQuestion) {
      this.requiredAnswer = !!data.requiredAnswer;

      if (data.settings) {
        this.showAnswers = !!data.settings.showAnswers;
        this.showCorrectAnswer = !!data.settings.showCorrectAnswer;
        this.showMainMedia = !!data.settings.showMainMedia;
        this.showDescription = !!data.settings.showDescription;
      }
    }
  }
}
