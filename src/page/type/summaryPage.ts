module Page {
  export class SummaryPage extends Page {
    type = Type.SummaryPage;
    stats: API.EndStats[];

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);

      if (engageform.type === Engageform.Type.Outcome) {
        this.title = 'Outcomes';

      } else {
        this.title = 'Scores';
      }

      this.stats = data.stats;
    }
  }
}
