module Page {
  export class StartPage extends Page {
    type = Type.StartPage;

    button: string;

    isCoverPage = true;

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);

      if (data.coverPage && data.coverPage.buttonText !== undefined) {
        this.button = data.coverPage.buttonText;
      }
    }
  }
}
