module API {
  export interface IQuizQuestionAnswer {
    quizQuestionId?: string;
    userIdent?: string;
    selectedAnswerId?: string;
    correctAnswerId?: string;
  }
}
