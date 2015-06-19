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
        this.page.engageform.message = 'Changing answer is not allowed';
        return;
      }

      return super.makeSend({quizQuestionId: this.page.id, rateItValue: this.ordinal}).then((res) => {
        var data: IPageSent = <IPageSent>{};

        if (res.selectedValue) {
          data.selectedValue = res.selectedValue
        }

        super.save(data);
        this.page.selectAnswer(data);

        return data;
      });
    }
  }
}
