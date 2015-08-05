module Page {
  export class BuzzCase extends Case {
    type = CaseType.Buzz;

    constructor(page: IPage, data) {
      super(page, data);
      this.page = page;
    }

    send(): ng.IPromise<IPageSent> {
      // We dont really send buzzes here, just increase buttonClickSum here
      this.page.clickBuzzer();
      var deferred = Bootstrap.$q.defer();
      deferred.resolve(<IPageSent>{});
      return deferred.promise;
    }

    trueBuzzerSend(BCS: number): ng.IPromise<IPageSent> {
      console.log('[ Buzzer ] True send (' + BCS + ')');
      // Ignore change answer option
      // if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
      //   return Bootstrap.$q.reject('Changing answer is not allowed');
      // }

      return super.makeSend({ quizQuestionId: this.page.id, buttonClickSum: BCS }).then((res) => {
        var data: IPageSent = <IPageSent>{};

        // IMO we don't need that since buzzer have fake answerId's
        // super.save(data);
        // this.page.selectAnswer(data);

        return data;
      });
    }
  }
}
