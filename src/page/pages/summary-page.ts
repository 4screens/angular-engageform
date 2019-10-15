import EndStats from '../../api/end-stats.interface'
import QuizQuestion from '../../api/quiz-question.interface'
import Engageform from '../../engageform/engageform'
import { EngageformType } from '../../engageform/engageform-type.enum'
import Page from '../page'
import { PageType } from '../page-type.enum'

export default class SummaryPage extends Page {
  readonly type = PageType.SummaryPage
  stats: EndStats[]

  constructor(engageform: Engageform, data: QuizQuestion) {
    super(engageform, data)

    if (data.text) {
      this.title = data.text
    } else {
      if (engageform.type === EngageformType.Outcome) {
        this.title = 'Outcomes'
      } else {
        this.title = 'Scores'
      }
    }

    this.stats = data.stats
  }
}
