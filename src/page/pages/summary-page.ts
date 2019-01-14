import { EngageformType } from '../../engageform/engageform-type.enum'
import Page from '../page'
import { PageType } from '../page-type.enum'
import EndStats from '../../api/end-stats.interface'
import EngageformProperties from '../../engageform/engageform-properties'
import QuizQuestion from '../../api/quiz-question.interface'

export default class SummaryPage extends Page {
  type = PageType.SummaryPage
  stats: EndStats[]

  constructor(engageform: EngageformProperties, data: QuizQuestion) {
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
