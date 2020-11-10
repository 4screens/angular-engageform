import angular from 'angular'
import QuizFinish from '../../api/quiz-finish.interface'
import { EndPage } from '../../page/pages/end-page'
import Engageform from '../engageform'
import { EngageformType } from '../engageform-type.enum'

export default class Score extends Engageform {
  readonly type = EngageformType.Calculator;

  setCurrentEndPage(): angular.IPromise<QuizFinish> {
    return super.setCurrentEndPage().then((data) => {
      if (this.endPages.length) {
        const pageId =this.endPages[0]
        const page = this.pages[pageId] as EndPage
        page.score = data.totalScore
        this.setCurrent(pageId)

      } else {
        this.enabled = false
        this.message = 'Thank you!'
      }

      return data
    })

  }
}
