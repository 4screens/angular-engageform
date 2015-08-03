module Page {
  export class Buzzer extends Page {
    type = Type.Buzzer;

    buzzerTheme: {
      imgIdleSrc: string,
      imgPressedSrc: string,
      audioSrc: string
    };

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);

      // this.sent().then(sent => {
      //   this.buzzed = [];
      // });

      // FIXME: Relpace when themes will be ready
      // this.buzzerTheme = data.buzzerTheme;
      this.buzzerTheme = Bootstrap.config.fakeBuzzerTheme || {};
    };

    selectAnswer(sent) {};
  }
}
