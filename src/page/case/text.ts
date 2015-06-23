module Page {
  export class TextCase extends Case {
    type = CaseType.Text;

    result: number;
    selected: boolean = false;
    correct: boolean = false;
    incorrect: boolean = false;

    title: string;

    constructor(page: IPage, data) {
      super(page, data);

      this.title = data.text;
    }

    send() {
      if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
        return Bootstrap.$q.reject('Changing answer is not allowed');
      }

      return super.makeSend({selectedAnswerId: this.id}).then((res) => {
        var data: IPageSent = <IPageSent>{};

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
