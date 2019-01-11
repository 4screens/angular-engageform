import Page from '../page'
import { PageType } from '../page-type.enum'
import CaseProperties from '../case-properties'
import BuzzCase from '../case/buzz'
import QuizQuestion from '../../api/quiz-question'
import { IPromise } from 'angular'
import EngageformProperties from '../../engageform/engageform-properties'

export class Buzzer extends Page {
  type = PageType.Buzzer

  buzzerTheme: {
    imgIdleSrc: string;
    imgPressedSrc: string;
    audioSrc: string;
  }

  buttonClickSum: number = 0

  private _timeout: IPromise<any>

  private _connected = false

  constructor(engageform: EngageformProperties, data: QuizQuestion) {
    super(engageform, data)

    // Make only one case with buzzed ammount
    this.cases.push(<CaseProperties>new BuzzCase(<Page>this, {_id: 0, buttonClickSum: this.buttonClickSum}))

    // Clear previous timeout
    if (this._timeout) {
      Bootstrap.$timeout.cancel(this._timeout)
    }

    // Start loop
    this.buzzLoop(0)

    // FIXME: Relpace when themes will be ready
    // this.buzzerTheme = data.buzzerTheme;
    this.buzzerTheme = Bootstrap.config.fakeBuzzerTheme || {}
  }

  private buzzLoop(iteration: number) {
    if (!this._connected) {
      this._connected = true
    }

    if (this.buttonClickSum > 0) {
      this._connected = true

      // True send - POST to server, we dont need then here since socket respond with global buttonClickSum
      this.cases[0].trueBuzzerSend(this.buttonClickSum)
      this.cases[0].buttonClickSum = this.buttonClickSum
      this.engageform.sendAnswerCallback(this.engageform.title || this.engageform.id,
        this.engageform.current ? this.engageform.current.title || this.engageform.current.id : null,
        this.cases[0])
    }

    // Not a buzzer - stop cycle
    if (iteration > 0 && this.engageform && this.engageform.current && this.engageform.current.id !== this.id) {
      return
    }

    // Loop
    this._timeout = Bootstrap.$timeout(() => {
      this.buzzLoop(iteration + 1)
    }, 3000)

    // Clear buttonClickSum
    this.buttonClickSum = 0
  }

  clickBuzzer() {
    // Limit buzzes
    if (this.buttonClickSum < 100) {
      this.buttonClickSum++
    }
  }
}
