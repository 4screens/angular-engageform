import { WithId } from '../../types'
import Case from '../case'
import { CaseType } from '../case-type.enum'
import Page from '../page'
import PageSentProperties from '../page-sent.interface'

export class ProjectCase extends Case {
  readonly type = CaseType.Project

  constructor(page: Page, data: WithId) {
    super(page, data)
  }

  send() {
    return super.makeSend({selectedAnswerIds: [this.id]}).then((res) => {
      const data: PageSentProperties = <PageSentProperties>{}

      super.save(data)
      return data
    })
  }
}
