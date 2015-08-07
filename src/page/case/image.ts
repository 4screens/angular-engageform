module Page {
  export class ImageCase extends Case {
    type = CaseType.Image;

    result: number;
    selected: boolean = false;
    correct: boolean = false;
    incorrect: boolean = false;

    title: string;
    media: string;

    constructor(page: IPage, data) {
      super(page, data);

      this.title = data.text;
      this.media = Util.Cloudinary.getInstance().prepareImageUrl(
        data.imageFile,
        300,
        data.imageData
      );
    }

    send() {
      if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
        return Bootstrap.$q.reject('Changing answer is not allowed');
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
