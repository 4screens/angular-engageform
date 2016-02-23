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

    isCoverPage = true;

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

    private personalizeShares() {
      // console.log('[ Endpage ] Personalize shares');
      if (this.engageform.typeName === 'outcome' || this.engageform.typeName === 'score') {
        // Replace $TITLE$ and $RESULT$ tags in the translation and set the title.
        this.socialData.title = this.engageform.texts.SCORE_AND_OUTCOME_SHARE
          .replace(/\$RESULT\$/gi, String(this.score))
          .replace(/\$TITLE\$/gi, this.engageform.title);

        if (this.media && this.settings.showMainMedia) {
          this.socialData.imageUrl = this.media;
        }
      }
    }

    get fbLink() {
      if (
        Bootstrap.config.backend && Bootstrap.config.backend.domain &&
        Bootstrap.config.share && Bootstrap.config.share.facebook &&
        this.socialData && this.socialData.title && this.socialData.description &&
        this.socialData.imageUrl && this.engageform && this.engageform.id
        ) {
        this.personalizeShares();
        return Bootstrap.config.backend.domain + Bootstrap.config.share.facebook + '?quizId=' + this.engageform.id +
          '&description=' + encodeURIComponent(this.socialData.description) + '&name=' +
          encodeURIComponent(this.socialData.title) + '&image=' + this.socialData.imageUrl;
      }
      return null;
    }

    get twLink() {
      if (this.socialData && this.socialData.title && this.socialData.link) {
        this.personalizeShares();
        return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(this.socialData.title)
          + ' ' + this.socialData.link + ' via @4screens';
      }
      return null;
    }
  }
}
