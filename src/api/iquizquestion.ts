module API {
  export interface IQuizQuestion {
    _id: string;
    type: string;
    text: string;
    description: string;
    coverPage: {
      buttonText: string;
      outcome: string;
      scoreRange: {
        max: number;
        min: number;
      }
      showSocialShares: boolean;
    }
    imageData: {
      containerHeight: number;
      left: number;
      top: number;
      width: number;
    }
    imageFile: string;
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
