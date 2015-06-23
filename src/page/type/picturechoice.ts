module Page {
  export class PictureChoice extends Page {
    type = Type.PictureChoice;

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);

      if (!data.answers) {
        return;
      }

      data.answers.map((answer) => {
        this.cases.push(<ICase>new ImageCase(<IPage>this, answer));
      });

      if (this.cases.length) {
        this.sent().then(sent => {
          this.selectAnswer(sent);
        });

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

        if (sent.results) {
          vcase.result = sent.results[vcase.id] || 0;
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
