module API {
  export interface IQuizQuestion {
    _id: string;
    type: string;
    text: string;
    requiredAnswer: boolean;
    rateIt: {
      maxLabel: string;
      minLabel: string;
      maxRateItValue: number;
      rateType: string;
    };
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
