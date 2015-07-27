module Engageform {
  export class Outcome extends Engageform {
    type = Type.Outcome;

    setCurrentEndPage(): ng.IPromise<API.IQuizFinish> {
      return super.setCurrentEndPage().then((data) => {
        var hasEndPage = false;

        this.endPages.map((pageId) => {
          var page: Page.IPage = <Page.IPage>this.pages[pageId];
          if (page.outcome === data.outcome) {
            hasEndPage = true;
            this.setCurrent(pageId);
          }
        });

        if (!hasEndPage) {
          this.enabled = false;
          this.message = 'Thank you!';
        }

        return data;
      });
    }
  }
}
