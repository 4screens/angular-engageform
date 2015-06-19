module Engageform {
  export class Score extends Engageform {
    type = Type.Score;

    setCurrentEndPage():ng.IPromise<API.IQuizFinish> {
      return super.finish().then((data) => {
        var score = Math.round(data.totalScore / data.maxScore * 100);

        this.endPages.map((pageId) => {
          if (this.pages[pageId].rangeMin <= score && this.pages[pageId].rangeMax >= score) {
            this.pages[pageId].score = score;
            this.setCurrent(pageId);
          }
        });

        return data;
      });
    }
  }
}
