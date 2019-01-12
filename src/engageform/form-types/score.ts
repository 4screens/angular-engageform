import angular from 'angular'
import QuizFinish from '../../api/quiz-finish.interface'
import PageProperties from '../../page/page-properties'
import Engageform from '../engageform'
import { EngageformType } from '../engageform-type.enum'

export default class Score extends Engageform {
  type = EngageformType.Score

  setCurrentEndPage(): angular.IPromise<QuizFinish> {
    return super.setCurrentEndPage().then((data) => {
      var score = 100
      var hasEndPage = false

      // Error divide by zero...
      if (data.maxScore > 0) {
        score = Math.round(data.totalScore / data.maxScore * 100)
      }

      this.endPages.map((pageId) => {
        var page: PageProperties = <PageProperties>this.pages[pageId]
        if (page.rangeMin <= score && page.rangeMax >= score) {
          hasEndPage = true
          this.pages[pageId].score = score
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
