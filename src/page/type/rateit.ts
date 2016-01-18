module Page {
  export class Rateit extends Page {
    type = Type.Rateit;

    result: number;
    labelMin: string;
    labelMax: string;

    selectedValue: number = 0;

    /**
     * Rateit is unique in a way it shows results. Typically it's the cases matter to show them, but here it's
     * the page that has results, so the method is required here.
     * @returns {boolean} Should the result be shown?
     */
    shouldShowResults(): boolean {
      return this.settings.showResults && this.result > 0;
    }

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);

      this.labelMin = data.rateIt.minLabel;
      this.labelMax = data.rateIt.maxLabel;

      this.cases = Array.apply(null, Array(data.rateIt.maxRateItValue)).map((value, index) => {
        return this.createCase(index + 1, data.rateIt.rateType);
      });

      this.sent().then(sent => {
        if (sent.selectedValue) {
          this.selectedValue = sent.selectedValue;
          this.selectAnswer(sent);
        }
      });
    }

    createCase(ordinal, symbol): ICase {
      return new IterationCase(this, { ordinal, symbol });
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

        if (sent.selectedValue === vcase.ordinal) {
            this.engageform.sendAnswerCallback(this.engageform.title || this.engageform.id,
                    this.engageform.current ? this.engageform.current.title || this.engageform.current.id : null,
                    vcase);
        }
      });
    }
    }
}
