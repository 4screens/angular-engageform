module Page {
  export class Poster extends Page {
    type = Type.Poster;
    private button: string;
    private exitLink: boolean;
    private link: string;

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);
      if (data.coverPage) {
        this.button = data.coverPage.buttonText;
        this.exitLink = data.coverPage.exitLink;
        this.link = data.coverPage.link;
      }
    }
  }
}
