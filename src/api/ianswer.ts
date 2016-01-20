module API {
  export interface Answer {
    quizId: string;
    quizQuestionId: string;
    time: string;
    selectedAnswerId?: string;
    inputs?: [ { _id: string, value: string } ];
    rateItValue?: number;
  }
}
