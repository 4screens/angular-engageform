module API {
  export interface IQuizQuestion {
    _id: string;
    type: string;
    text: string;
    requiredAnswer: boolean;
    answers: {}[];
    forms: {
      inputs: {}[];
    };
    settings: {
      showAnswers: boolean;
      showCorrectAnswer: boolean;
      showMainMedia: boolean;
      showDescription: boolean;
    };
  }
}
