module Page {
  export class StartPage extends Page {
    type = Type.StartPage;

    button: string = 'Let\'s get started';

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);

      if (data.coverPage) {
        this.button = data.coverPage.buttonText || this.button;
      }
    }
  }
}
