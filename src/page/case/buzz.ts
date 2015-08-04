module Page {
  export class BuzzCase extends Case {
    type = CaseType.Buzz;

    buttonClickSum: number = 0;

    constructor(page: IPage, data) {
      super(page, data);
      this.buttonClickSum = data.buttonClickSum;
    }

    send() {
      // Ignore change answer option
      // if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
      //   return Bootstrap.$q.reject('Changing answer is not allowed');
      // }

      return super.makeSend({ quizQuestionId: this.page.id, buttonClickSum: this.buttonClickSum }).then((res) => {
        var data: IPageSent = <IPageSent>{};

        // IMO we don't need that since buzzer have fake answerId's
        // super.save(data);
        // this.page.selectAnswer(data);

        return data;
      });
    }
  }
}
