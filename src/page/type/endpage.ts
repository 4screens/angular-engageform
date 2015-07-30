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
    exitLink: boolean;
    link: string;
    socialData: ISocialData;

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion, settings: Engageform.ISetting) {
      super(engageform, data);

      this.socialData = <ISocialData>{
        title: settings.share.title,
        description: settings.share.description,
        imageUrl: settings.share.imageUrl,
        link: settings.share.link
      };

      if (data.coverPage) {
        this.button = data.coverPage.buttonText;
        this.outcome = data.coverPage.outcome;
        this.social = data.coverPage.showSocialShares;
        this.exitLink = data.coverPage.exitLink;
        this.link = data.coverPage.link;

        if (data.coverPage.scoreRange) {
          this.rangeMax = data.coverPage.scoreRange.max;
          this.rangeMin = data.coverPage.scoreRange.min;
        }
      }
    }
  }
}
