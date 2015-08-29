interface ISendAnswerCallback {
  (quizName: string, questionName: string, vcase: Page.ICase): any;
}