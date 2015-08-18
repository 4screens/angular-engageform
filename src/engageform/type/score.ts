module Engageform {
  export class Score extends Engageform {
    type = Type.Score;

    setCurrentEndPage(): ng.IPromise<API.IQuizFinish> {
      return super.setCurrentEndPage().then((data) => {
        var score = 100;
        var hasEndPage = false;

        // Error divide by zero...
        if (data.maxScore > 0) {
          score = Math.round(data.totalScore / data.maxScore * 100);
        }

        this.endPages.map((pageId) => {
          var page: Page.IPage = <Page.IPage>this.pages[pageId];
          if (page.rangeMin <= score && page.rangeMax >= score) {
            hasEndPage = true;
            this.pages[pageId].score = score;
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
