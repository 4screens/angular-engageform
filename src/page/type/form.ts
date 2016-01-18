module Page {
  export class Form extends Page {
    type = Type.Form;

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);

      if (!data.forms) {
        return;
      }

      this.cases = data.forms.inputs.map((input) => {
        return this.createCase(input);
      });

      if (this.cases.length) {
        this.sent().then(sent => {
          this.selectAnswer(sent);
        });
      }
    }

    createCase(input): ICase {
      return new InputCase(this, input);
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
        this.engageform.sendAnswerCallback(
          this.engageform.title || this.engageform.id,
          this.engageform.current ? this.engageform.current.title || this.engageform.current.id : null,
          this.cases[0]
        );
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
