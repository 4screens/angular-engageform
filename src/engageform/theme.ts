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
    backgroundImageConvertedFile: string = '';

    tabBorderColor: string = '';
    tabFontColor: string = '';
    tabColor: string = '';

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
        this.tabColor = data.theme.tabColor || '';
        this.tabFontColor = data.theme.tabFontColor || '';
        this.tabBorderColor = data.theme.tabBorderColor || '';

        if (data.theme.customThemeCssFile) {
          this.customThemeCssFile = Bootstrap.config.backend.api + '/uploads/' + data.theme.customThemeCssFile;
        }

        if (data.theme.backgroundImageFile) {
          this.convertBackgroundImage();
        }
      }
    }

    convertBackgroundImage() {
      this.backgroundImageConvertedFile = Bootstrap.cloudinary.prepareBackgroundImageUrl(
        this.backgroundImageFile,
        window.innerWidth,
        window.innerHeight,
        parseInt(this.backgroundImageBlur, 10),
        this.backgroundImagePosition
      );
    }
    }
}
