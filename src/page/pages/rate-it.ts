import Page from '../page'
import { CaseType } from '../case-type.enum'
import EngageformProperties from '../../engageform/engageform-properties'
import QuizQuestion from '../../api/quiz-question.interface'
import IterationCase from '../case/iteration'
import Result from '../../api/result.interface'

export default class RateIt extends Page {
  readonly type = CaseType.Rateit

  result: number
  labelMin: string
  labelMax: string

  selectedValue: number = 0

  /**
   * Rateit is unique in a way it shows results. Typically it's the cases matter to show them, but here it's
   * the page that has results, so the method is required here.
   * @returns {boolean} Should the result be shown?
   */
  shouldShowResults(): boolean {
    return this.settings.showResults && this.result > 0
  }

  constructor(engageform: EngageformProperties, data: QuizQuestion) {
    super(engageform, data)

    this.labelMin = data.rateIt.minLabel
    this.labelMax = data.rateIt.maxLabel

    this.cases = Array.apply(null, Array(data.rateIt.maxRateItValue)).map((value, index) => {
      return this.createCase(index + 1, data.rateIt.rateType)
    })

    this.sent().then(sent => {
      if (sent.selectedValue) {
        this.selectedValue = sent.selectedValue
        this.selectAnswer(sent)
      }
    })
  }

  createCase(ordinal: any, symbol: any): CaseProperties {
    return new IterationCase(this, {ordinal, symbol})
  }

  selectAnswer(sent: any) {
    if (sent.selectedValue) {
      this.filled = true
      this.selectedValue = sent.selectedValue
    }

    if (sent.result) {
      this.result = sent.result
    }

    this.cases.map((vcase: CaseProperties) => {
      vcase.selected = sent.selectedValue >= vcase.ordinal

      if (sent.selectedValue === vcase.ordinal) {
        this.engageform.sendAnswerCallback(this.engageform.title || this.engageform.id,
          this.engageform.current ? this.engageform.current.title || this.engageform.current.id : null,
          vcase)
      }
    })
  }

  setResults(results: Result) {
    this.result = results.average
    this.selectedValue = results.average
  }
}
