module Page {
  export class Rateit extends Page {
    type = Type.Rateit;

    labelMin: string;
    labelMax: string;

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);

      this.labelMin = data.rateIt.minLabel;
      this.labelMax = data.rateIt.maxLabel;

      for (var i = 1; i <= data.rateIt.maxRateItValue; i++) {
        this.cases.push(<ICase>new IterationCase(<IPage>this, {
          ordinal: i,
          symbol: data.rateIt.rateType
        }));
      }

      var sent = <IPageSent>Bootstrap.localStorage.get('page.' + this.id) || <IPageSent>{};

      if (!sent.selectedValue) {
        return;
      }

      this.selectAnswer(sent);
    }

    selectAnswer(sent) {
      if (sent.selectedValue) {
        this.filled = true;
      }

      this.cases.map((vcase: ICase) => {
        vcase.selected = false;

        if (sent.selectedValue >= vcase.ordinal) {
          vcase.selected = true;
        }
      });
    }
  }
}
