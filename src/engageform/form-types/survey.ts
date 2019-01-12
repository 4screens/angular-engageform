import angular from 'angular'
import QuizFinish from '../../api/quiz-finish.interface'
import Engageform from '../engageform'
import { EngageformType } from '../engageform-type.enum'

export default class Survey extends Engageform {
  type = EngageformType.Survey

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
