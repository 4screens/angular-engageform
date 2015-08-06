/// <reference path="isettings.ts" />

module Page {
  export class Settings implements ISetting {
    showResults: boolean = false;
    showCorrectAnswer: boolean = false;
    showMainMedia: boolean = false;
    showDescription: boolean = false;
    requiredAnswer: boolean = false;

    constructor(data: API.IQuizQuestion) {
      this.requiredAnswer = !!data.requiredAnswer;

      if (data.settings) {
        this.showResults = !!data.settings.showAnswers;
        this.showCorrectAnswer = !!data.settings.showCorrectAnswer;
        this.showMainMedia = !!data.settings.showMainMedia;
        this.showDescription = !!data.settings.showDescription;
      }
    }
  }
}
