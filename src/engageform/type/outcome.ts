module Engageform {
  export class Outcome extends Engageform {
    type = Type.Outcome;

    setCurrentEndPage(): ng.IPromise<API.IQuizFinish> {
      return super.setCurrentEndPage().then((data) => {
        var hasEndPage = false;

        this.endPages.map((pageId) => {
          if (this.pages[pageId].outcome === data.outcome) {
            hasEndPage = true;
            this.setCurrent(pageId);
          }
        });

        if (!hasEndPage) {
          this.message = 'Thank you!';
        }

        return data;
      });
    }
  }
}
