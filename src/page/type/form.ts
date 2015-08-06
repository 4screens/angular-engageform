module Page {
  export class Form extends Page {
    type = Type.Form;

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);

      if (!data.forms) {
        return;
      }

      data.forms.inputs.map((input) => {
        this.cases.push(<ICase>new InputCase(<IPage>this, input));
      });

      if (this.cases.length) {
        this.sent().then(sent => {
          this.selectAnswer(sent);
        });
      }
    }

    send(vcase: ICase): ng.IPromise<IPageSent> {
      var deferred = Bootstrap.$q.defer();
      var validated = true;

      this.cases.map((input) => {
        if (!input.validate()) {
          validated = false;
        }
      });

      if (validated) {
        this.filled = true;
        deferred.resolve(this.cases[0].send());
      } else {
        this.filled = false;
        deferred.resolve(<IPageSent>{});
      }

      return deferred.promise;
    }

    selectAnswer(sent) {
      this.cases.map((vcase: ICase) => {
        vcase.value = sent[vcase.id] || '';
      });
    }
  }
}
