module Page {
  export class Buzzer extends Page {
    type = Type.Buzzer;

    buzzerTheme: {
      imgIdleSrc: string;
      imgPressedSrc: string;
      audioSrc: string;
    };

    buttonClickSum: number = 0;

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);
      console.log('[ Buzzer ] Constructor');

      // Make only one case with buzzed ammount
      this.cases.push(<ICase>new BuzzCase(<IPage>this, { _id: iteration, buttonClickSum: this.buttonClickSum }));

      // Clear previous timeout
      if (this.buzzLoop.timeout) clearTimeout(this.buzzLoop.timeout);

      // Start loop
      this.buzzLoop(0);

      // FIXME: Relpace when themes will be ready
      // this.buzzerTheme = data.buzzerTheme;
      this.buzzerTheme = Bootstrap.config.fakeBuzzerTheme || {};
    };

    selectAnswer(sent) {
      console.log('[ Buzzer ] Select answer');
    };

    send(sent) {
      console.log('[ Buzzer ] Send');
    };

    private buzzLoop(iteration: number) {
      console.log('[ Buzzer ] Buzz');
      if (this.buttonClickSum > 0) {

        // Clear buttonClickSum
        this.buttonClickSum = 0;

        // We dont need then here since socket respond with global buttonClickSum
        this.cases[0].send();
      }

      if (this._engageform && this._engageform.current) {
        console.log(this._engageform.current._pageId);
        console.log(this._pageId);
      }

      // Not a buzzer - stop cycle
      if (this._engageform && this._engageform.current && this._engageform.current._pageId !== this._pageId) {
        return;
      }

      this.buzzLoop.timeout = setTimeout(() => { this.buzzLoop(iteration) }, 3000);
    }

    private buzz() {
      // Limit buzzes
      if (this.buttonClickSum < 100) {
        this.buttonClickSum++;
      }
    }
  }
}
