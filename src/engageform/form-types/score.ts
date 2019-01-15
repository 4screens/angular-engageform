import angular from 'angular'
import QuizFinish from '../../api/quiz-finish.interface'
import { EndPage } from '../../page/pages/end-page'
import Engageform from '../engageform'
import { EngageformType } from '../engageform-type.enum'

export default class Score extends Engageform {
  readonly type = EngageformType.Score

  setCurrentEndPage(): angular.IPromise<QuizFinish> {
    return super.setCurrentEndPage().then((data) => {
      let score = 100
      let hasEndPage = false

      // Error divide by zero...
      if (data.maxScore > 0) {
        score = Math.round(data.totalScore / data.maxScore * 100)
      }

      this.endPages.map((pageId) => {
        const page = this.pages[pageId] as EndPage
        const {rangeMin = 0, rangeMax = 0} = page
        if (rangeMin <= score && rangeMax >= score) {
          hasEndPage = true
          page.score = score
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
