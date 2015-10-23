/// <reference path="isettings.ts" />

module Engageform {
  export class Settings implements ISetting {
    allowAnswerChange: boolean = false;
    hideMessageAfterDelay: number = 3000;
    share: {
      title: string;
      imageUrl: string;
      link: string;
      description: string;
    };

    constructor(data: API.IQuiz) {
      if (data.settings) {
        this.allowAnswerChange = !!data.settings.allowAnswerChange;

        if (data.settings.hideMessageAfterDelay) {
          this.hideMessageAfterDelay = data.settings.hideMessageAfterDelay;
        }

        if (data.settings.share) {
          this.share = data.settings.share;

          if (!this.share.imageUrl && Bootstrap.config.share && Bootstrap.config.share.defaultImgUrl) {
            this.share.imageUrl = Bootstrap.config.share.defaultImgUrl;
          }
        }
      }
    }
  }
}
