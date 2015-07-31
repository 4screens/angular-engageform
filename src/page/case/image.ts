module Page {
  export class ImageCase extends Case {
    type = CaseType.Image;

    selected: boolean = false;
    correct: boolean = false;
    incorrect: boolean = false;

    title: string;
    image: string;
    imageData: IImageData;

    constructor(page: IPage, data) {
      super(page, data);

      this.title = data.text;
      this.image = data.imageFile;
      this.imageData = data.imageData;
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

        super.save(data);
        this.page.selectAnswer(data);

        return data;
      });
    }
  }
}
