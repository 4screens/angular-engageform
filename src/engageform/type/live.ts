module Engageform {
  export class Live extends Engageform {
    type = Type.Live;

    initPages() {
      var deferred = Bootstrap.$q.defer();
      deferred.resolve(this);
      return deferred.promise;
    };

    initPage(page) {
      this.buildPages([page]);
      this.setCurrent(page._id);
    }
  }
}
