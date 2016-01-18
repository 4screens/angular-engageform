module Page {
  export class PictureChoice extends Page {
    type = Type.PictureChoice;

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);

      if (!data.answers) {
        return;
      }

      this.cases = data.answers.map((answer) => {
        return this.createCase(answer);
      });

      if (this.cases.length) {
        this.sent().then(sent => {
          this.selectAnswer(sent);
        });
      }
    }

    createCase(answer): ICase {
      return new ImageCase(this, answer);
    }

    refreshAnswer(sent: IPageSent, question: API.IQuizQuestion): IPageSent {
      question.answers.map((answer: any) => {
        sent.results[answer._id] = answer.percent;
      });

      return sent;
    }

    selectAnswer(sent) {
      this.cases.map((vcase: ICase) => {
        vcase.selected = false;
        vcase.correct = false;
        vcase.incorrect = false;

        if (vcase.id === sent.selectedCaseId) {
            this.engageform.sendAnswerCallback(
              this.engageform.title || this.engageform.id,
              this.engageform.current ? this.engageform.current.title || this.engageform.current.id : null,
              vcase
            );
            this.filled = true;
            vcase.selected = true;
        }

        if (sent.results) {
          vcase.result = sent.results[vcase.id] || 0;
        }

        // Mark case as correct or incorrect.
        if (vcase.id === sent.correctCaseId) {
          vcase.correct = true;
        } else {
          vcase.incorrect = true;
        }
      });
    }
  }
}
