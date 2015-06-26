module API {
  export interface IQuiz {
    _id: string;
    title: string;
    type: string;

    settings: {
      allowAnswerChange: boolean;
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
    };
  }
}