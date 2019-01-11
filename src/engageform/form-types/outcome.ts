import angular from 'angular'
import { Type } from '../engageform-type.enum'
import QuizFinish from '../../api/quiz-finish'

export default class Outcome extends Engageform {
  type = Type.Outcome

  setCurrentEndPage(): angular.IPromise<QuizFinish> {
    return super.setCurrentEndPage().then((data) => {
      var hasEndPage = false

      this.endPages.map((pageId) => {
        var page: Page.IPage = <Page.IPage>this.pages[pageId]
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
