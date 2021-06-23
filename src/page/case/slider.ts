import Bootstrap from '../../bootstrap'
import Case from '../case'
import { CaseType } from '../case-type.enum'
import Page from '../page'
import PageSentProperties from '../page-sent.interface'

export default class SliderCase extends Case {
  readonly type = CaseType.Slider
  ordinal: number

  constructor(page: Page, data: { ordinal: number }) {
    super(page, {...data, _id: ''})
    this.ordinal = data.ordinal
  }

  send() {
    if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
      return Bootstrap.$q.reject({textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed'})
    }

    return super.makeSend({quizQuestionId: this.page.id, sliderValue: this.ordinal})
      .then((res) => {
        const data: PageSentProperties = {} as PageSentProperties
        if (res.selectedValue) {
          data.selectedValue = res.selectedValue
        }

        if (res.avgSliderValue) {
          data.result = +res.avgSliderValue
        }

        super.save(data)
        this.page.selectAnswer(data)

        return data
      })
  }
}
