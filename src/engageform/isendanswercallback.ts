module Engageform {
  export interface ISendAnswerCallback {
    (quizName:string, questionName:string, vcase:Page.ICase): any;
  }
}
