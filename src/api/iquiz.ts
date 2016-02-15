/// <reference path="../branding/ibranding.ts" />
/// <reference path="../engageform/itexts.ts"/>


module API {
  export interface IQuiz {
    _id: string;
    title: string;
    type: string;

    tabs: {
      chatTitle: string;
      liveTitle: string;
      logoUrl: string;
      headerText: string;
    };

    texts: Engageform.ITexts;

    settings: {
      allowAnswerChange: boolean;
      branding?: Branding.IBrandingData,
      hideMessageAfterDelay: number;
      share?: {
        title: string;
        imageUrl: string;
        link: string;
        description: string;
      }
    };
    theme: {
      answerBackgroundColor: string;
      answerBorderColor: string;
      answerColor: string;
      backgroundBrightness: string;
      backgroundColor: string;
      backgroundImageBlur: string;
      backgroundImageFile: string;
      backgroundImagePosition: string;
      buttonColor: string;
      font: string;
      questionColor: string;
      customThemeCssFile: string;
      tabColor: string;
      tabFontColor: string;
      tabBorderColor: string;
    };
  }
}
