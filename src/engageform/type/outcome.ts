module Engageform {
  export class Outcome extends Engageform {
    type = Type.Outcome;

    setCurrentEndPage():ng.IPromise<API.IQuizFinish> {
      return super.setCurrentEndPage().then((data) => {
        this.endPages.map((pageId) => {
          if (this.pages[pageId].outcome === data.outcome) {
            this.setCurrent(pageId);
          }
        });
        return data;
      });
    }
  }
}
