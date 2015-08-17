module Page {
  export class Buzzer extends Page {
    type = Type.Buzzer;

    buzzerTheme: {
      imgIdleSrc: string;
      imgPressedSrc: string;
      audioSrc: string;
    };

    buttonClickSum: number = 0;

    private _timeout;

    constructor(engageform: Engageform.IEngageform, data: API.IQuizQuestion) {
      super(engageform, data);
      console.log('[ Buzzer ] Constructor');

      // Make only one case with buzzed ammount
      this.cases.push(<ICase>new BuzzCase(<IPage>this, { _id: 0, buttonClickSum: this.buttonClickSum }));

      // Clear previous timeout
      if (this._timeout) {
        Bootstrap.$timeout.cancel(this._timeout);
      }

      // Start loop
      this.buzzLoop(0);

      // FIXME: Relpace when themes will be ready
      // this.buzzerTheme = data.buzzerTheme;
      this.buzzerTheme = Bootstrap.config.fakeBuzzerTheme || {};
    }

    private buzzLoop(iteration: number) {
      console.log('[ Buzzer ] Buzz');
      if (this.buttonClickSum > 0) {

        // True send - POST to server, we dont need then here since socket respond with global buttonClickSum
        this.cases[0].trueBuzzerSend(this.buttonClickSum);
      }

      // Not a buzzer - stop cycle
      if (iteration > 0 && this.engageform && this.engageform.current && this.engageform.current.id !== this.id) {
        return;
      }

      // Loop
      this._timeout = Bootstrap.$timeout(() => {
        this.buzzLoop(iteration + 1);
      }, 3000);

      // Clear buttonClickSum
      this.buttonClickSum = 0;
    }

    clickBuzzer() {
      // Limit buzzes
      if (this.buttonClickSum < 100) {
        this.buttonClickSum++;
      }

      console.log('[ Buzzer ] Click! (' + this.buttonClickSum + ')');
    }
  }
}
