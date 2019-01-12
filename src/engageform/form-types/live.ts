import angular from 'angular'
import QuizFinish from '../../api/quiz-finish.interface'
import QuizQuestion from '../../api/quiz-question.interface'
import Bootstrap from '../../bootstrap'
import PageProperties from '../../page/page-properties'
import Engageform from '../engageform'
import { EngageformType } from '../engageform-type.enum'

export default class Live extends Engageform {
  type = EngageformType.Live

  initPages() {
    var deferred = Bootstrap.$q.defer()
    deferred.resolve(this)
    return deferred.promise
  }

  initPage(page: QuizQuestion): PageProperties {
    // Clean other pages.
    this.cleanPages()

    // Initialize the single page.
    return super.initPage(page)
  }

  setCurrentEndPage(): angular.IPromise<QuizFinish> {
    var deferred = Bootstrap.$q.defer()
    deferred.resolve()
    return deferred.promise
  }
}
