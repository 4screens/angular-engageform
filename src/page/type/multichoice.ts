module Page {
  export class MultiChoice extends Page {
    type = Type.MultiChoice;

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);

      if (!data.answers) {
        return;
      }

      data.answers.map((answer) => {
        this.cases.push(<ICase>new TextCase(<IPage>this, answer));
      });

      if (this.cases.length) {
        var sent = Bootstrap.localStorage.get('page.' + this.id);

        if (!(sent || {}).selectedCaseId) {
          return;
        }

        this.selectAnswer(sent);
      }
    }

    selectAnswer(sent) {
      this.cases.map((vcase: ICase) => {
        vcase.selected = false;
        vcase.correct = false;
        vcase.incorrect = false;

        if (vcase.id === sent.selectedCaseId) {
          this.filled = true;
          vcase.selected = true;
        }

        if (sent.correctCaseId && (vcase.id === sent.correctCaseId || vcase.id === sent.selectedCaseId)) {
          if (vcase.id === sent.correctCaseId) {
            vcase.correct = true;
          } else {
            vcase.incorrect = true;
          }
        }

      });
    }
  }
}
