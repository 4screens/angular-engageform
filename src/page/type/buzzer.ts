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
      this.cases.push(<ICase>new BuzzCase(<IPage>this, { _id: 0, buttonClickSum: this.buttonClickSum }));

      // Clear previous timeout
      if (this.buzzLoop.hasOwnProperty('timeout')) clearTimeout(this.buzzLoop['timeout']); // Nasty array reference couse of compiler error ?

      // Start loop
      this.buzzLoop(0);

      // FIXME: Relpace when themes will be ready
      // this.buzzerTheme = data.buzzerTheme;
      this.buzzerTheme = Bootstrap.config.fakeBuzzerTheme || {};
    };

    // selectAnswer(sent) {
    //   console.log('[ Buzzer ] Select answer');
    // };

    // send(sent) {
    //   console.log('[ Buzzer ] Send');
    // };

    private buzzLoop(iteration: number) {
      console.log('[ Buzzer ] Buzz');
      if (this.buttonClickSum > 0) {

        // True send - POST to server, we dont need then here since socket respond with global buttonClickSum
        this.cases[0].trueBuzzerSend(this.buttonClickSum);
      }

      // if (this._engageform && this._engageform.current) {
      //   console.log(this._engageform.current._pageId);
      //   console.log(this._pageId);
      // }

      // Not a buzzer - stop cycle
      if (iteration > 0 && this.engageform && this.engageform.current && this.engageform.current.id !== this.id) {
        return;
      }

      // Loop
      this.buzzLoop['timeout'] = setTimeout(() => { this.buzzLoop(iteration + 1) }, 3000); // Nasty array reference couse of compiler error ?

      // Clear buttonClickSum
      this.buttonClickSum = 0;
    }

    clickBuzzer() {
      // Limit buzzes
      if (this.buttonClickSum < 100) {
        this.buttonClickSum++;
      }

      console.log('[ Buzzer ] Click! (' + this.buttonClickSum +')');
    }
  }
}
