import angular from 'angular'
import { Type } from '../engageform-type.enum'
import QuizFinish from '../../api/quiz-finish'

export default class Survey extends Engageform {
  type = Type.Survey

  setCurrentEndPage(): angular.IPromise<QuizFinish> {
    return super.setCurrentEndPage().then((data) => {
      if (this.endPages.length) {
        this.setCurrent(this.endPages[0])
      } else {
        this.enabled = false
        this.message = 'Thank you!'
      }

      return data
    })
  }
}
