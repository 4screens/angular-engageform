module Engageform {
  export class Live extends Engageform {
    type = Type.Live;

    initPages() {
      var deferred = Bootstrap.$q.defer();
      deferred.resolve(this);
      return deferred.promise;
    };

    initPage(page: API.IQuizQuestion): Page.IPage {
      // Clean other pages.
      this.cleanPages();

      // Initialize the single page.
      return super.initPage(page);
    }

    setCurrentEndPage(): ng.IPromise<API.IQuizFinish> {
      var deferred = Bootstrap.$q.defer();
      deferred.resolve();
      return deferred.promise;
    }
  }
}
