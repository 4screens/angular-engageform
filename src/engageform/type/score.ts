module Engageform {
  export class Score extends Engageform {
    type = Type.Score;

    setCurrentEndPage(): ng.IPromise<API.IQuizFinish> {
      return super.setCurrentEndPage().then((data) => {
        var score = Math.round(data.totalScore / data.maxScore * 100);
        var hasEndPage = false;

        this.endPages.map((pageId) => {
          if (this.pages[pageId].rangeMin <= score && this.pages[pageId].rangeMax >= score) {
            hasEndPage = true;
            this.pages[pageId].score = score;
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
