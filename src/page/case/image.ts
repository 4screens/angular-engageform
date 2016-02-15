module Page {
  export class ImageCase extends Case {
    type = CaseType.Image;

    title: string;
    media: string;
    mediaWidth: number;
    mediaHeight: number;

    constructor(page: IPage, data) {
      super(page, data);

      this.title = data.text;
      this.media = Bootstrap.cloudinary.prepareImageUrl(
        data.imageFile,
        300,
        data.imageData
      );
      this.mediaWidth = 300;
      if (data.imageData && data.imageData.containerRatio) {
        this.mediaHeight = Math.round(300 * data.imageData.containerRatio);
      } else {
        this.mediaHeight = Math.round(data.imageData.containerHeight);
      }
    }

    send() {
      if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
        return Bootstrap.$q.reject({textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed'});
      }

      return super.makeSend({selectedAnswerId: this.id}).then((res) => {
        var data = <IPageSent>{};

        if (res.selectedAnswerId) {
          data.selectedCaseId = res.selectedAnswerId;
        }

        if (res.correctAnswerId) {
          data.correctCaseId = res.correctAnswerId;
        }

        for (var caseId in res.stats) {
          if (res.stats.hasOwnProperty(caseId)) {
            data.results = data.results || {};
            if (/.{24}/.test(caseId)) {
              data.results[caseId] = res.stats[caseId];
            }
          }
        }

        super.save(data);
        this.page.selectAnswer(data);

        return data;
      });
    }
  }
}
