module Page {
  export class IterationCase extends Case {
    type = CaseType.Iteration;

    selected: boolean = false;

    ordinal: number;
    symbol: string;

    constructor(page: IPage, data) {
      super(page, data);

      this.ordinal = data.ordinal;
      this.symbol = data.symbol;
    }

    send() {
      if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
        return Bootstrap.$q.reject({textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed'});
      }

      return super.makeSend({quizQuestionId: this.page.id, rateItValue: this.ordinal}).then((res) => {
        var data: IPageSent = <IPageSent>{};

        if (res.selectedValue) {
          data.selectedValue = res.selectedValue;
        }

        if (res.avgRateItValue) {
          data.result = +res.avgRateItValue;
        }

        super.save(data);
        this.page.selectAnswer(data);

        return data;
      });
    }
  }
}
