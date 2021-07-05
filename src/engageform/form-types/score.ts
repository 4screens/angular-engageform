import angular from 'angular'
import QuizFinish from '../../api/quiz-finish.interface'
import { EndPage } from '../../page/pages/end-page'
import Engageform from '../engageform'
import { EngageformType } from '../engageform-type.enum'

export default class Score extends Engageform {
  readonly type = EngageformType.Score

  setCurrentEndPage(): angular.IPromise<QuizFinish> {
    return super.setCurrentEndPage().then((data) => {
      let score = data.totalScore

      if (this.endPages.length === 1) {
        const pageId =this.endPages[0]
        const page = this.pages[pageId] as EndPage
        page.score = data.totalScore
        this.setCurrent(pageId)

      } else if (this.endPages.length > 1) {
        let hasEndPage = false

        this.endPages.map((pageId) => {
          const page = this.pages[pageId] as EndPage
          const {rangeMin = undefined, rangeMax = undefined} = page
          if ((!rangeMin || rangeMin <= score) && (!rangeMax || rangeMax >= score)) {
            hasEndPage = true
            page.score = score
            this.setCurrent(pageId)
          }
        })

        if (!hasEndPage) {
          this.enabled = false
          this.message = 'Thank you!'
        }
      }



      return data
    })
  }
}
