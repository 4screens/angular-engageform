import QuizQuestion from '../../api/quiz-question.interface'
import Result from '../../api/result.interface'
import Engageform from '../../engageform/engageform'
import Case from '../case'
import IterationCase from '../case/iteration'
import Page from '../page'
import { PageType } from '../page-type.enum'

export default class RateIt extends Page {
  readonly type = PageType.Rateit

  result = 0
  labelMin: string
  labelMax: string

  selectedValue: number | undefined = undefined

  /**
   * Rateit is unique in a way it shows results. Typically it's the cases matter to show them, but here it's
   * the page that has results, so the method is required here.
   * @returns {boolean} Should the result be shown?
   */
  shouldShowResults(): boolean {
    return this.settings.showResults && this.result > 0
  }

  constructor(engageform: Engageform, data: QuizQuestion) {
    super(engageform, data)

    this.labelMin = data.rateIt.minLabel
    this.labelMax = data.rateIt.maxLabel

    const isNumberRateType = data.rateIt.rateType === 'number'
    const hasLinearScaleValues = isNumberRateType && !!data.rateIt.linearScale;
    const values = hasLinearScaleValues ? this.range(data.rateIt.linearScale.minValue, (data.rateIt.linearScale.maxValue + 1)) : Array(data.rateIt.maxRateItValue)

    this.cases = Array.apply(null, values).map((value, index) => {
      return this.createCase(hasLinearScaleValues ? (value as number) : index + 1, data.rateIt.rateType)
    })

    this.sent().then(sent => {
      if (sent.selectedValue) {
        this.selectedValue = sent.selectedValue
        this.selectAnswer(sent)
      }
    })
  }

  range(start: number, stop: number, step = 1): number[] {
    return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
  }

  createCase(ordinal: number, symbol: string): Case {
    return new IterationCase(this, {ordinal, symbol})
  }

  selectAnswer(sent: any) {
    if (sent.selectedValue !== null && sent.selectedValue !== undefined) {
      this.filled = true
      this.selectedValue = sent.selectedValue
    }

    if (sent.result) {
      this.result = sent.result
    }

    this.cases.map((vcase: Case) => {
      vcase.selected = sent.selectedValue >= (vcase as IterationCase).ordinal
      if (sent.selectedValue === (vcase as IterationCase).ordinal) {
        this.engageform.sendAnswerCallback(this.engageform.title || this.engageform.id,
          this.engageform.current ? this.engageform.current.title || this.engageform.current.id : null,
          vcase)
      }
    })
  }

  setResults(results: Result) {
    this.result = results.average || 0
    this.selectedValue = results.average || 0
  }
}
