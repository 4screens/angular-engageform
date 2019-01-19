import angular from 'angular'
import QuizFinish from '../../api/quiz-finish.interface'
import { EndPage } from '../../page/pages/end-page'
import Engageform from '../engageform'
import { EngageformType } from '../engageform-type.enum'

export default class Outcome extends Engageform {
  readonly type = EngageformType.Outcome

  setCurrentEndPage(): angular.IPromise<QuizFinish> {
    return super.setCurrentEndPage().then((data) => {
      let hasEndPage = false

      this.endPages.map((pageId) => {
        const page = this.pages[pageId] as EndPage
        if (page.outcome === data.outcome) {
          hasEndPage = true
          this.setCurrent(pageId)
        }
      })

      if (!hasEndPage) {
        this.enabled = false
        this.message = 'Thank you!'
      }

      return data
    })
  }
}
