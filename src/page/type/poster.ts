module Page {
  export class Poster extends Page {
    type = Type.Poster;

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);
    }
  }
}
