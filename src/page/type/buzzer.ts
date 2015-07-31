module Page {
  export class Buzzer extends Page {
    type = Type.Buzzer;

    buzzed: Array<Number>;
    buzzerTheme: {
      imgIdleSrc: string,
      imgPressedSrc: string,
      audioSrc: string
    };

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);

      this.sent().then(sent => {
        this.buzzed = [];
      });

      // FIXME: Relpace when themes will be ready
      this.buzzerTheme = {
        imgIdleSrc: 'http://png.findicons.com/files/icons/1056/flavours/48/button_heart_red.png',
        imgPressedSrc: 'http://png.findicons.com/files/icons/1056/flavours/48/button_heart_green.png',
        audioSrc: 'http://freesound.org/data/previews/178/178186_33044-lq.mp3'
      };
      // this.buzzerTheme = data.buzzerTheme;
    };

    selectAnswer(sent) {
      this.buzzed.push(Date.now());
    };
  }
}
