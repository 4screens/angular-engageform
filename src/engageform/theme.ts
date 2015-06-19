/// <reference path="itheme.ts" />

module Engageform {
  export class Theme implements ITheme {
    answerBackgroundColor: string = '';
    answerBorderColor: string = '';
    answerColor: string = '';
    backgroundBrightness: string = '';
    backgroundColor: string = '';
    backgroundImageBlur: string = '';
    backgroundImageFile: string = '';
    backgroundImagePosition: string = '';
    buttonColor: string = '';
    font: string = '';
    questionColor: string = '';
    customThemeCssFile: string = '';

    constructor(data: API.IQuiz) {
      if (data.theme) {
        this.answerBackgroundColor = data.theme.answerBackgroundColor || '';
        this.answerBorderColor = data.theme.answerBorderColor || '';
        this.answerColor = data.theme.answerColor || '';
        this.backgroundBrightness = data.theme.backgroundBrightness || '';
        this.backgroundColor = data.theme.backgroundColor || '';
        this.backgroundImageBlur = data.theme.backgroundImageBlur || '';
        this.backgroundImageFile = data.theme.backgroundImageFile || '';
        this.backgroundImagePosition = data.theme.backgroundImagePosition || '';
        this.buttonColor = data.theme.buttonColor || '';
        this.font = data.theme.font || '';
        this.questionColor = data.theme.questionColor || '';
        this.customThemeCssFile = data.theme.customThemeCssFile || '';
      }
    }
  }
}