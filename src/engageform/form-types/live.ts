import angular from 'angular'
import { Type } from '../engageform-type.enum'
import QuizQuestion from '../../api/quiz-question'
import QuizFinish from '../../api/quiz-finish'

export default class Live extends Engageform {
    type = Type.Live;

    initPages() {
      var deferred = Bootstrap.$q.defer();
      deferred.resolve(this);
      return deferred.promise;
    };

    initPage(page: QuizQuestion): Page.IPage {
      // Clean other pages.
      this.cleanPages();

      // Initialize the single page.
      return super.initPage(page);
    }

    setCurrentEndPage(): angular.IPromise<QuizFinish> {
      var deferred = Bootstrap.$q.defer();
      deferred.resolve();
      return deferred.promise;
    }
  }
