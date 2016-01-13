module API {
  export interface IQuizAndPagesInit {
    [index: string]: any;
    quizData: API.IQuiz;
    pages: API.IPages;
  }
}
