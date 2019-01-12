import Case from '../page/case'

export default interface SendAnswerCallback {
  (quizName: string, questionName: string, vcase: Case): any
}
