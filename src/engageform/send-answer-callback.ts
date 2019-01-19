import Case from '../page/case'
import { NullableString } from '../types'

export default interface SendAnswerCallback {
  (quizName: string, questionName: NullableString, vcase: Case): any
}
