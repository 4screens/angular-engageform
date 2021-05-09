import Bootstrap from '../../bootstrap'
import { WithId } from '../../types'
import Case from '../case'
import { CaseType } from '../case-type.enum'
import Page from '../page'
import PageSentProperties from '../page-sent.interface'

export class TextCase extends Case {
  readonly type = CaseType.Text

  constructor(page: Page, data: WithId & { text: string }) {
    super(page, data)
    this.title = data.text
  }

  send() {
    if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
      return Bootstrap.$q.reject({textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed'})
    }

    return super.makeSend({selectedAnswerIds: [this.id]}).then((res) => {
      const data: PageSentProperties = <PageSentProperties>{}

      if (res.selectedAnswerIds) {
        data.selectedCaseIds = res.selectedAnswerIds
      }

      if (res.correctAnswerIds) {
        data.correctCaseIds = res.correctAnswerIds
      }

      for (const caseId in res.stats) {
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
