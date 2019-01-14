import Bootstrap from '../../bootstrap'
import { MaybeNumber, WithId } from '../../types'
import Case from '../case'
import { CaseType } from '../case-type.enum'
import Page from '../page'
import PageSentProperties from '../page-sent.interface'

export default class IterationCase extends Case {
  readonly type = CaseType.Iteration
  symbol: string
  ordinal: number

  constructor(page: Page, data: WithId & { ordinal: number, symbol: string }) {
    super(page, data)
    this.ordinal = data.ordinal
    this.symbol = data.symbol
  }

  send() {
    if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
      return Bootstrap.$q.reject({textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed'})
    }

    return super.makeSend({quizQuestionId: this.page.id, rateItValue: this.ordinal})
      .then((res) => {
        const data: PageSentProperties = {} as PageSentProperties

        if (res.selectedValue) {
          data.selectedValue = res.selectedValue
        }

        if (res.avgRateItValue) {
          data.result = +res.avgRateItValue
        }

        super.save(data)
        this.page.selectAnswer(data)

        return data
      })
  }
}
