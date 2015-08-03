module Page {
  export class Rateit extends Page {
    type = Type.Rateit;

    result: number;
    labelMin: string;
    labelMax: string;

    selectedValue: number = 0;

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

      this.sent().then(sent => {
        if (sent.selectedValue) {
          this.selectedValue = sent.selectedValue;
          this.selectAnswer(sent);
        }
      });
    }

    selectAnswer(sent) {
      if (sent.selectedValue) {
        this.filled = true;
        this.selectedValue = sent.selectedValue;
      }

      if (sent.result) {
        this.result = sent.result;
      }

      this.cases.map((vcase: ICase) => {
        vcase.selected = sent.selectedValue >= vcase.ordinal;
      });
    }
  }
}
