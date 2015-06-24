module Page {
  export class EndPage extends Page {
    type = Type.EndPage;

    /* outcome */
    button: string;
    outcome: string;
    social: boolean;
    /* score */
    score: number;
    rangeMin: number;
    rangeMax: number;

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);

      if (data.coverPage) {
        this.button = data.coverPage.buttonText;
        this.outcome = data.coverPage.outcome;
        this.social = data.coverPage.showSocialShares;

        if (data.coverPage.scoreRange) {
          this.rangeMax = data.coverPage.scoreRange.max;
          this.rangeMin = data.coverPage.scoreRange.min;
        }
      }
    }
  }
}
