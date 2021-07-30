import angular from 'angular'
import QuizFinish from '../../api/quiz-finish.interface'
import Engageform from '../engageform'
import { EngageformType } from '../engageform-type.enum'

export default class Poll extends Engageform {
  readonly type = EngageformType.Poll

  setCurrentEndPage(): angular.IPromise<QuizFinish> {
    return super.setCurrentEndPage().then((data) => {
      if (this.endPages.length) {
        var endPageIdx = this.skipLogicSelectedEndPage
        this.setCurrent(this.endPages[endPageIdx])
      } else {
        this.enabled = false
        this.message = 'Thank you!'
      }

      return data
    })
  }
}
