import angular from 'angular'
import QuizFinish from '../../api/quiz-finish.interface'
import QuizQuestion from '../../api/quiz-question.interface'
import Bootstrap from '../../bootstrap'
import Page from '../../page/page'
import Engageform from '../engageform'
import { EngageformType } from '../engageform-type.enum'

export default class Live extends Engageform {
  readonly type = EngageformType.Live

  initPages() {
    const deferred = Bootstrap.$q.defer()
    deferred.resolve(this)
    return deferred.promise
  }

  initPage(page: QuizQuestion): Page {
    // Clean other pages.
    this.cleanPages()

    // Initialize the single page.
    return super.initPage(page)
  }

  setCurrentEndPage(): angular.IPromise<QuizFinish> {
    const deferred = Bootstrap.$q.defer<QuizFinish>()
    deferred.resolve()
    return deferred.promise
  }
}
