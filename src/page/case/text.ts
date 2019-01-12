import Bootstrap from '../../bootstrap'
import Case from '../case'
import { CaseType } from '../case-type.enum'
import PageProperties from '../page-properties'
import PageSentProperties from '../page-sent.interface'

export class TextCase extends Case {
  type = CaseType.Text
  title: string

  constructor(page: PageProperties, data: any) {
    super(page, data)

    this.title = data.text
  }

  send() {
    if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
      return Bootstrap.$q.reject({textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed'})
    }

    return super.makeSend({selectedAnswerId: this.id}).then((res) => {
      var data: PageSentProperties = <PageSentProperties>{}

      if (res.selectedAnswerId) {
        data.selectedCaseId = res.selectedAnswerId
      }

      if (res.correctAnswerId) {
        data.correctCaseId = res.correctAnswerId
      }

      for (var caseId in res.stats) {
        if (res.stats.hasOwnProperty(caseId)) {
          data.results = data.results || {}
          if (/.{24}/.test(caseId)) {
            data.results[caseId] = res.stats[caseId]
          }
        }
      }

      super.save(data)
      this.page.selectAnswer(data)

      return data
    })
  }
}
